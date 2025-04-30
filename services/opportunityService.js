const Opportunity = require('../models/Opportunity');

class OpportunityService {
  async getAllOpportunities() {
    return await Opportunity.find({ approved: true });
  }

  async getOpportunityById(id) {
    return await Opportunity.findOne({ _id: id, approved: true });
  }

  async createOpportunity(opportunityData) {
    return await new Opportunity(opportunityData).save();
  }

  async updateOpportunity(id, opportunityData) {
    return await Opportunity.findByIdAndUpdate(id, opportunityData, { new: true });
  }

  async deleteOpportunity(id) {
    return await Opportunity.findByIdAndDelete(id);
  }

  async getApprovedOpportunities() {
    return await Opportunity.find({ approved: true });
  }
  async getUnapprovedOpportunities() {
    return await Opportunity.find({ approved: false });
  }

  async approveOpportunity(id, adminId) {
    return await Opportunity.findByIdAndUpdate(
      id,
      { approved: true, approved_by: adminId },
      { new: true }
    );
  }
}

module.exports = new OpportunityService();
