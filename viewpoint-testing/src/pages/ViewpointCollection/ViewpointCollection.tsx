import { StarFilled, StarOutlined } from "@ant-design/icons";
import useAbortRequest from "@hooks/useAbortRequest";
import { usePermissions } from "@hooks/usePermissions";
import {
  IDomainFilter,
  IResponseData,
  IResponseViewPointCollection,
  ITableData,
  IUser,
  JsonDetail,
  Pagination,
} from "@models/model";
import { rootState } from "@models/type";
import { domainActions } from "@redux/slices";
import ExcelAPI from "@services/excelAPI";
import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import {
  DEFAULT_PAGINATION,
  ERR_CANCELED_RECEIVE_RESPONSE,
  PROCESSING_STATUS,
  PUBLISH_STATUS,
  ROLE,
  SORT,
} from "@utils/constants";
import { getUser } from "@utils/helpersUtils";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { convertTreeDataSelector } from "@utils/treeUtils";
import { Badge, Modal, Space, Tag, Tooltip } from "antd";
import { DataSourceItemType } from "antd/lib/auto-complete";
import {
  FilterValue,
  SorterResult,
  TablePaginationConfig,
} from "antd/lib/table/interface";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiDetail } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { FaRegClone } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { routes } from "routes";
import { CommonAction, TableViewpointCollection } from "./components";
import ModalClone from "./components/ModalClone/ModalClone";
import ModalCreate from "./components/ModalCreate/ModalCreate";
import ModalImportVPCollection from "./components/ModalImportVPCollection/ModalImportVPCollection";
import { ViewpointCollectionWrapper } from "./ViewpointCollectionStyle";

const ViewpointCollection = () => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const { domain } = useSelector((state: rootState) => state.domain);
  const user: IUser = getUser();
  const dispatch = useDispatch();
  const location = useLocation();
  const { checkPermission } = usePermissions();

  const [valueSelect, setValueSelect] =
    useState<IResponseViewPointCollection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenCreate, setIsModalOpenCreate] = useState<boolean>(false);
  const [isModalOpenImport, setIsModalOpenImport] = useState<boolean>(false);
  const [treeDataDomainSelector, setTreeDataDomainSelector] = useState<
    IDomainFilter[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [dataViewpointCollectionList, setDataViewpointCollectionList] =
    useState<ITableData[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { signal } = useAbortRequest();

  // handle call get all viewpoint collection
  const handleCallAPI = async (
    pageNumber: string | number,
    pageSize: string | number
  ) => {
    try {
      setLoading(true);
      const response: IResponseData =
        await viewpointCollectionAPI.getAllViewpointCollection(
          {
            payload: {
              search: location.search,
              PageNumber: pageNumber,
              PageSize: pageSize,
            },
          },
          signal
        );
      const dataViewpointCollection: ITableData[] = response.data.map(
        (value: IResponseViewPointCollection) => {
          return {
            key: value?.id,
            id: value?.id,
            domain: value?.domains
              .reduce((array, currentDomain) => {
                const newDomain = JSON.parse(
                  currentDomain?.detail as string
                ) as JsonDetail;
                array.push(newDomain.Name);
                return array;
              }, [])
              .join(", "),
            PublishStatus:
              value?.publishStatus === +PUBLISH_STATUS.PUBLISHING ? (
                <Badge color="orange" text={t("common:status.publishing")} />
              ) : value?.publishStatus === +PUBLISH_STATUS.PUBLISHED ? (
                <Badge color="green" text={t("common:status.published")} />
              ) : (
                ""
              ),
            ProcessingStatus:
              value?.processingStatus === +PROCESSING_STATUS.ON_GOING ? (
                <Badge color="orange" text={t("common:status.on_going")} />
              ) : value?.processingStatus === +PROCESSING_STATUS.UPDATING ? (
                <Badge color="orange" text={t("common:status.updating")} />
              ) : (
                ""
              ),
            rating: (value?.avgRating || value?.avgRating === 0) && (
              <Space size={2}>
                <span>{value?.avgRating}</span>
                {value?.avgRating !== 0 ? <StarFilled /> : <StarOutlined />}
                <span>({value?.countUserRating})</span>
              </Space>
            ),
            lastUpdate: new Date(value?.detail?.updateAt).toLocaleString(),
            createdAt: new Date(value?.detail?.createAt).toLocaleString(),
            name: (
              <Link to={routes.ViewpointCollection.path[0] + `/${value.id}`}>
                {value?.cloneCollectionId ? null : (
                  <Tag style={{ color: "#fff" }} color="#87d068">
                    {t("common:common.base")}
                  </Tag>
                )}
                {value?.detail?.name}
              </Link>
            ),
            owner: value?.userCreate?.account,
            action: (
              <ViewpointCollectionWrapper>
                <Space size={12} key={value?.id}>
                  <Tooltip title={t("common:common.view_detail")}>
                    <Link
                      to={routes.ViewpointCollection.path[0] + `/${value?.id}`}
                    >
                      <BiDetail
                        className="icon-action"
                        style={{
                          visibility: checkPermission(["VIEWPOINT.VIEW"])
                            ? "visible"
                            : "hidden",
                        }}
                      />
                    </Link>
                  </Tooltip>

                  <Tooltip title={t("common:common.clone")}>
                    <FaRegClone
                      className="icon-action"
                      onClick={() => showModal(value)}
                      style={{
                        visibility: checkPermission(["VIEWPOINT.CLONE"])
                          ? "visible"
                          : "hidden",
                      }}
                    />
                  </Tooltip>

                  <Tooltip title={t("common:common.delete")}>
                    <BsTrash
                      className="icon-action"
                      onClick={() => showModalDelete(value)}
                      style={{
                        visibility:
                          user?.role === ROLE.ADMIN ||
                          (checkPermission(["VIEWPOINT.DELETE"]) &&
                            value?.userCreate?.account === user?.account)
                            ? "visible"
                            : "hidden",
                      }}
                    />
                  </Tooltip>
                </Space>
              </ViewpointCollectionWrapper>
            ),
            description: value?.detail?.description,
          };
        }
      );
      setDataViewpointCollectionList(dataViewpointCollection);
      setPagination({
        ...response.metaData,
      });
    } catch (error) {
      if (error?.code === ERR_CANCELED_RECEIVE_RESPONSE) {
        return;
      }
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      setLoading(false);
    }
  };

  // handle delete viewpoint collection
  const handleDeleteViewpointCollection = async (
    value: IResponseViewPointCollection
  ) => {
    try {
      setLoading(true);
      await viewpointCollectionAPI.deleteCollection({
        payload: value,
      });
      await handleCallAPI(pagination.currentPage, pagination.pageSize);
      showSuccessNotification(
        t("common:viewpoint_collection.delete_successfully")
      );
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      setLoading(false);
      Modal.destroyAll();
    }
  };

  // Modal import viewpoint collection
  const handleShowImportModal = () => {
    setIsModalOpenImport(true);
  };

  // Modal clone collection
  const showModal = (value: IResponseViewPointCollection) => {
    setValueSelect(value);
    setIsModalOpen(true);
  };

  // Modal create viewpoint collection
  const handleShowCreateModal = () => {
    setIsModalOpenCreate(true);
  };

  const handleOkCreate = () => {
    setIsModalOpenCreate(false);
  };

  const handleCancelCreate = () => {
    setIsModalOpenCreate(false);
  };

  // Modal delete collection
  const showModalDelete = (value: IResponseViewPointCollection) => {
    Modal.confirm({
      title: t("common:viewpoint_collection.modal_delete"),
      content: t("common:viewpoint_collection.content_modal_delete"),
      okText: t("common:common.delete"),
      cancelText: t("common:common.cancel"),
      onOk: () => handleDeleteViewpointCollection(value),
      width: 600,
    });
  };

  const handleResetFilter = () => {
    setPagination({
      ...pagination,
      currentPage: 1,
    });
    setSearchParams({});
  };

  const handleDownloadViewpointCollectionTemplate = async () => {
    try {
      ExcelAPI.downloadViewpointCollectionTemplate();
    } catch (error) {
      showErrorNotification(error?.code);
    }
  };

  const handleSortTable = (
    _pagination: TablePaginationConfig,
    filter: Record<string, FilterValue> & {
      ProcessingStatus: string;
      PublishStatus: string;
      domain: string[];
      owner: string;
    },
    sorter: SorterResult<DataSourceItemType>
  ) => {
    // filter
    if (filter?.ProcessingStatus) {
      searchParams.set("ProcessingStatus", filter?.ProcessingStatus);
    } else {
      searchParams.delete("ProcessingStatus");
    }
    if (filter?.PublishStatus) {
      searchParams.set("PublishStatus", filter?.PublishStatus);
    } else {
      searchParams.delete("PublishStatus");
    }
    if (filter?.domain) {
      searchParams.delete("DomainIds");
      filter?.domain.map((item) => {
        searchParams.append("DomainIds", item);
      });
    } else {
      searchParams.delete("DomainIds");
    }
    if (filter?.owner) {
      searchParams.set("Owner", filter?.owner);
    } else {
      searchParams.delete("Owner");
    }

    // sort
    if (sorter.columnKey === "name") {
      searchParams.delete("SortRating");
      searchParams.delete("SortDatetime");
      if (sorter.order === "ascend") {
        searchParams.set("Sort", SORT.ACS);
      } else if (sorter.order === "descend") {
        searchParams.set("Sort", SORT.DESC);
      } else {
        searchParams.delete("Sort");
      }
    } else if (sorter.columnKey === "rating") {
      searchParams.delete("Sort");
      searchParams.delete("SortDatetime");
      if (sorter.order === "ascend") {
        searchParams.set("SortRating", SORT.ACS);
      } else if (sorter.order === "descend") {
        searchParams.set("SortRating", SORT.DESC);
      } else {
        searchParams.delete("SortRating");
      }
    } else if (sorter.columnKey === "lastUpdate") {
      searchParams.delete("SortRating");
      searchParams.delete("Sort");
      if (sorter.order === "ascend") {
        searchParams.set("SortDatetime", SORT.ACS);
      } else if (sorter.order === "descend") {
        searchParams.set("SortDatetime", SORT.DESC);
      } else {
        searchParams.delete("SortDatetime");
      }
    }
    setSearchParams(searchParams);
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };

  // convert domain data to tree data
  useEffect(() => {
    setTreeDataDomainSelector(convertTreeDataSelector(domain));
  }, [domain]);

  // get all domain
  useEffect(() => {
    dispatch(domainActions.getDomain());
  }, []);

  // call api get when change filter or sort
  useEffect(() => {
    handleCallAPI(pagination.currentPage, pagination.pageSize);
  }, [location.search]);

  return (
    <ViewpointCollectionWrapper>
      <CommonAction
        pagination={pagination}
        setPagination={setPagination}
        searchParams={searchParams}
        onResetFilter={handleResetFilter}
        setSearchParams={setSearchParams}
        onShowCreateModal={handleShowCreateModal}
        onShowImportViewpointCollection={handleShowImportModal}
        onDownloadViewpointTemplate={handleDownloadViewpointCollectionTemplate}
      />

      <TableViewpointCollection
        loading={loading}
        pagination={pagination}
        domainTreeFilter={treeDataDomainSelector}
        dataSource={dataViewpointCollectionList}
        callAPI={handleCallAPI}
        setPagination={setPagination}
        onSortTable={handleSortTable}
        searchParams={searchParams}
      />

      <ModalCreate
        domainTree={treeDataDomainSelector}
        isModalOpenCreate={isModalOpenCreate}
        setLoading={setLoading}
        loading={loading}
        handleOkCreate={handleOkCreate}
        handleCancelCreate={handleCancelCreate}
        setIsModalOpenCreate={setIsModalOpenCreate}
      />

      <ModalImportVPCollection
        open={isModalOpenImport}
        setOpen={setIsModalOpenImport}
        treeDataSelector={treeDataDomainSelector}
      />

      <ModalClone
        loading={loading}
        isModalOpen={isModalOpen}
        valueSelect={valueSelect}
        treeDataDomainSelector={treeDataDomainSelector}
        setLoading={setLoading}
        setIsModalOpen={setIsModalOpen}
        setValueSelect={setValueSelect}
      />
    </ViewpointCollectionWrapper>
  );
};

export default ViewpointCollection;
