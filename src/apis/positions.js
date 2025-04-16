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
    const response = await apiHelper.get(
      apiUrls.downloadCvs(projectId, positionId),
      { responseType: 'blob' } // Add this to handle binary data
    );

    // Create a Blob object from the response data
    const fileBlob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create a link element to trigger the file download
    const downloadLink = document.createElement('a');
    const url = window.URL.createObjectURL(fileBlob);
    downloadLink.href = url;
    downloadLink.download = 'CV_summary_list.xlsx'; // You can set a custom name for the file
    downloadLink.click();
    onSuccess(); // Handle the success callback
  } catch (error) {
    console.error("Error downloading CV summary list:", error);
    onFail("Error downloading CV summary list.");
  }
}

