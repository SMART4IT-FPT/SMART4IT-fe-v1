import apiHelper from "../utils/apiHelper";
import { apiUrls } from "../utils/constants";
import appStrings from "../utils/strings";

export async function getPositionsApi({ id, onFail, onSuccess }) {
  // Send get request
  const response = await apiHelper.get(apiUrls.getPositions(id));
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}

export async function createPositionApi({
  id,
  name,
  alias,
  description,
  startDate,
  endDate,
  criteria,
  onFail,
  onSuccess,
}) {
  // Send post request
  const data = {
    name,
    alias,
    description,
    start_date: startDate,
    end_date: endDate,
    criterias: criteria,
  };
  const response = await apiHelper.post(apiUrls.createPosition(id), data);
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}

export async function getPositionApi({
  projectId,
  positionId,
  onFail,
  onSuccess,
}) {
  // Send get request
  const response = await apiHelper.get(
    apiUrls.getPosition(projectId, positionId)
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}

export async function updateCriteriaApi({
  projectId,
  positionId,
  criteria,
  onFail,
  onSuccess,
}) {
  // Send request
  const data = {
    criterias: criteria,
  };
  const response = await apiHelper.put(
    apiUrls.updateCriteria(projectId, positionId),
    data
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}

export async function closePositionApi({
  projectId,
  positionId,
  onFail,
  onSuccess,
}) {
  // Send request
  const response = await apiHelper.put(
    apiUrls.closePosition(projectId, positionId)
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}

export async function openPositionApi({
  projectId,
  positionId,
  onFail,
  onSuccess,
}) {
  // Send request
  const response = await apiHelper.put(
    apiUrls.openPosition(projectId, positionId)
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}

export async function deletePositionApi({
  projectId,
  positionId,
  onFail,
  onSuccess,
}) {
  // Send request
  const response = await apiHelper.delete(
    apiUrls.deletePosition(projectId, positionId)
  );
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    onSuccess(response.data);
  } else {
    onFail(response.detail);
  }
}

export async function getPublicPositionApi({ positionId, onFail, onSuccess }) {
  // Send get request
  const response = await apiHelper.get(apiUrls.getPublicPosition(positionId));
  // Handle response
  if (response.msg) {
    console.log(response.msg);
    if (response.data) {
      onSuccess(response.data);
    } else {
      onFail(appStrings.language.utils.noDataFound);
    }
  } else {
    onFail(response.detail);
  }
}

export async function downloadCvsSummaryListApi({
  projectId,
  positionId,
  onFail,
  onSuccess,
}) {
  try {
    const response = await apiHelper.getBlob(
      apiUrls.downloadCvs(projectId, positionId)
    );
    

    // ✅ Kiểm tra đúng loại blob
    if (!(response?.data instanceof Blob)) {
      const text = await response?.data?.text?.() || "[Không có dữ liệu]";
      throw new Error("Dữ liệu không hợp lệ. Nội dung: " + text);
    }

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "CV_summary_list.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    onSuccess?.();
  } catch (error) {
    console.error("Error downloading CV summary list:", error);
    onFail?.("Lỗi khi tải file CV summary: " + error.message);
  }
}




