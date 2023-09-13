const { Query } = require('../connector/mysql_connector');

async function GetBuildings(offset, limit) {
  let sql = `select * from buildings LIMIT ${limit} OFFSET ${offset}`
  return await Query(sql);
}

async function GetAvgEuis() {
  let sql = `
  SELECT
  t.OSEBuildingID AS id,
  t.PrimaryPropertyType AS type,
  t1.gfa,
  t2.electricity
FROM
  buildings t
  LEFT JOIN (
    SELECT
      OSEBuildingID AS id,
      SUM(PropertyUseTypeGFA) AS gfa
    FROM
      Buildings_gfa
    GROUP BY
      OSEBuildingID
  ) t1 ON t.OSEBuildingID = t1.id
  LEFT JOIN (
    SELECT
      OSEBuildingID AS id,
      Value AS electricity
    FROM
      Metrics
    WHERE
      Metric = 'Electricity'
  ) t2 ON t.OSEBuildingID = t2.id;
      `;
  return await Query(sql);
}

module.exports = { GetAvgEuis, GetBuildings }