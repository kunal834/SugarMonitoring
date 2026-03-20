export const getSugarSummary = (userId) => [
  {
    $match: { userId: userId } 
  },
  {
    $group: {
      _id: null,
      avgSugar: { $avg: "$value" },
      maxSugar: { $max: "$value" },
      minSugar: { $min: "$value" },
      totalReadings: { $sum: 1 }, // Standard count method
      highCount: {
        $sum: { $cond: [{ $gt: ["$value", 180] }, 1, 0] }
      },
      normalCount: {
        $sum: { $cond: [{ $and: [{ $gte: ["$value", 70] }, { $lte: ["$value", 180] }] }, 1, 0] }
      },
      lowCount: {
        $sum: { $cond: [{ $lt: ["$value", 70] }, 1, 0] }
      }
    }
  },
  {
    $project: {
      _id: 0,
      avgSugar: { $round: ["$avgSugar", 1] },
      maxSugar: 1,
      minSugar: 1,
      totalReadings: 1,
      highCount: 1,
      normalCount: 1,
      lowCount: 1,
      // Estimated HbA1c (GMI) Calculation
      hba1c: {
        $round: [
          { $add: [3.31, { $multiply: [0.02392, "$avgSugar"] }] },
          1 // Rounding to 1 decimal place (e.g., 6.5%)
        ]
      },
      timeInRangePercent: { 
        $round: [
          { 
            $cond: [
              { $gt: ["$totalReadings", 0] },
              { $multiply: [{ $divide: ["$normalCount", "$totalReadings"] }, 100] },
              0
            ]
          }, 
          2
        ]
      }
    }
  }
];

export const Monthlysummary = (userId) => [
  {
    $match: { userId: userId.toString() } 
  },
  {
    $group: {
      // FIX 1: Use _id (with underscore) instead of $id
      _id: {
        year: { $year: "$entryDate" },
        month: { $month: "$entryDate" }
      },
      avgGlucose: { $avg: "$value" }
    }
  },
  {
    $project: {
      // FIX 2: Use _id: 0 (with underscore) to hide the ID
      _id: 0,
      month: "$_id.month",
      year: "$_id.year",
      avgGlucose: { $round: ["$avgGlucose", 1] },
      hba1c: { 
        $round: [{ $add: [3.31, { $multiply: [0.02392, "$avgGlucose"] }] }, 1] 
      }
    }
  },
  { $sort: { year: 1, month: 1 } }
];

export const getContributionData = (userId) => [
  { 
    $match: { 
      userId: userId.toString(),
      // Usually, you only want the last 365 days for a heatmap
      entryDate: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
    } 
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$entryDate" } },
      count: { $sum: 1 }
    }
  },
  { $sort: { "_id": 1 } }
];