const opportunityService = require('../../services/opportunityService');
const Opportunity = require('../../models/Opportunity');

describe('OpportunityService', () => {
  const mockOpportunity = {
    title: 'Test Opportunity',
    posted_by: 'Test Company',
    type: 'full-time',
    description: 'Test description',
    needs_approval: true,
    is_paid: true,
    amount: '$50,000'
  };

  describe('getAllOpportunities', () => {
    it('should return only approved opportunities', async () => {
      await Opportunity.create({ ...mockOpportunity, approved: true });
      await Opportunity.create({
        ...mockOpportunity,
        title: 'Unapproved Opp',
        approved: false
      });

      const opportunities = await opportunityService.getAllOpportunities();
      expect(opportunities).toHaveLength(1);
      expect(opportunities[0].approved).toBe(true);
    });
  });

  describe('createOpportunity', () => {
    it('should create a new opportunity', async () => {
      const opportunity = await opportunityService.createOpportunity(mockOpportunity);
      expect(opportunity.title).toBe(mockOpportunity.title);
      expect(opportunity.needs_approval).toBe(true);
    });
  });

  describe('approveOpportunity', () => {
    it('should approve an opportunity', async () => {
      const opportunity = await opportunityService.createOpportunity(mockOpportunity);
      const approvedOpp = await opportunityService.approveOpportunity(
        opportunity._id,
        'admin123'
      );

      expect(approvedOpp.approved).toBe(true);
      expect(approvedOpp.approved_by).toBe('admin123');
    });
  });
});