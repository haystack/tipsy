/**
 * Calculates the estimated amount per entry.
 *
 * @param settings
 * @param entry
 * @return
 */
export default function calculate(settings, entry) {
  var rateType = settings.rateType;
  var donationInterval;
  var donationGoal;

  // The donation goal amount is saved as a currency string, so we want
  // to emulate the empty amount if nothing was set.
  // var donationGoal = settings.donationGoal || '$0';

  if (rateType === "browsingRate") {

    donationInterval = settings.donationIntervalBrowsingRate || 60;
    donationGoal = settings.donationGoalBrowsingRate || '$0';

    // Convert timespent to time unit selected.
    var timeSpent = entry.timeSpent / 1000 / 60 / donationInterval;


    donationGoal = Number(donationGoal.slice(1));

    // Assign the estimated amount to the entry item.
    entry.estimatedAmount = (timeSpent * donationGoal).toFixed(2);

  } else if (rateType === "calendarRate") {

    donationInterval = settings.donationIntervalCalendarRate || 60;
    donationGoal = settings.donationGoalCalendarRate || '$0';

    // get fraction of time spent for this author out of all others
    var timeSpentFraction = entry.timeSpent / settings.timeSpentAuthored;

    var timeSinceBegin = Date.now() - settings.timeStarted;

    var unitAmount = (timeSinceBegin / 1000 / 60 / donationInterval) * Number(donationGoal.slice(1));

    var moneyOwed = timeSpentFraction * unitAmount - settings.totalPaid;

    entry.estimatedAmount = moneyOwed.toFixed(2);

  } else {
    console.error("No rate type set.");
  }
  return entry;
}
