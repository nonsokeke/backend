const mongoose = require('mongoose');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateUser = (user) => {
  const errors = [];
  if (!user.user_name) errors.push('Username is required');
  if (!user.email) errors.push('Email is required');
  if (!user.first_name) errors.push('First name is required');
  if (!user.last_name) errors.push('Last name is required');
  if (!user.year_graduated) errors.push('Graduation year is required');
  return errors;
};

const validateOpportunity = (opportunity) => {
  const errors = [];
  if (!opportunity.title) errors.push('Title is required');
  if (!opportunity.posted_by) errors.push('Posted by is required');
  if (!opportunity.description) errors.push('Description is required');
  if (typeof opportunity.needs_approval !== 'boolean') errors.push('needs_approval must be boolean');
  return errors;
};

module.exports = { isValidId, validateUser, validateOpportunity };
