import http from "../../utils/http-common";

const controller = "report";

const getTopCustomerReportAsync = (data) => {
  return http.get(
    `/${controller}/get-top-customer-report?branchId=${data.branchId}&startDate=${data.startDate}&endDate=${data.endDate}&pageNumber=${data.pageNumber}&pageSize=${data.pageSize}&keySearch=${data.keySearch}&sortNo=${data.sortNo}&sortCustomerName=${data.sortCustomerName}&sortOrderNumber=${data.sortOrderNumber}&sortTotalAmount=${data.sortTotalAmount}`
  );
};

const reportDataService = {
  getTopCustomerReportAsync,
};
export default reportDataService;
