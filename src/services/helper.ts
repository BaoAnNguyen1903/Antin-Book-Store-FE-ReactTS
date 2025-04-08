import dayjs from "dayjs";

export const FORMATE_DATE_DEFAULT = "YYYY-MM-DD";
export const FORMATE_DATE_VN = "DD-MM-YYYY";
export const MAX_UPLOAD_IMAGE_SIZE = 2; //2MB

export const dateRangeValidate = (dateRange: any) => {
    if (!dateRange) return undefined;

    const startDate = dayjs(dateRange[0], FORMATE_DATE_DEFAULT).toDate();
    const endDate = dayjs(dateRange[1], FORMATE_DATE_DEFAULT).toDate();

    return [startDate, endDate];
};