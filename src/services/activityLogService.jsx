import http from "../utils/http";

const activityLogService = {
    /**
     * Get list of activity logs with pagination and optional filters
     * @param {Object} params - page, perPage, log_name, event, subject_type, subject_id
     */
    list: (params = {}) => {
        return http.get(`activity-logs?${new URLSearchParams(params).toString()}`);
    },
};

export default activityLogService;
