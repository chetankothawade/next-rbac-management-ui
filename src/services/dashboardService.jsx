import http from "../utils/http";

const dashboardService = {
  /**
   * Dashboard summary
   * @param {Object} params
   * @param {string} params.currency - Currency code (INR, USD, etc)
   */
  getSummary(params = {}) {
    return http.get("dashboard/summary", {
      params,
    });
  },

  /**
   * Currency list
   */
  currencyList() {
    return http.get("currencies/have_invoices");
  },

  sendReminder(invoiceUuid) {
    return http.post(`invoices/${invoiceUuid}/send-reminder-email`);
  },

};

export default dashboardService;
