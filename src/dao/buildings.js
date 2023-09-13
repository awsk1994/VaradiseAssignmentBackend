const { Query } = require('../connector/mysql_connector');

async function GetBuildings(offset, limit) {
  let sql = `select * from buildings LIMIT ${limit} OFFSET ${offset}`
  return await Query(sql);
}

async function CountBuildings() {
  let sql = `select COUNT(OSEBuildingID) as count from buildings`
  const res = await Query(sql);
  return res[0].count;
}

async function GetAvgEuis() {
  let sql = `
  SELECT
  type,
  AVG(eui) as average_eui
FROM
  (
    SELECT
      t.OSEBuildingID AS id,
      t.PrimaryPropertyType AS type,
      t2.electricity,
      t1.gfa,
      t2.electricity / t1.gfa AS eui
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
      ) t2 ON t.OSEBuildingID = t2.id
  ) t3
GROUP BY
  type
      `;

  const results = await Query(sql);
  console.log("results:", results);
  let types = [];
  let averageEuis = [];
  results.forEach((result) => {
    types.push(result.type);
    averageEuis.push(result.average_eui);
  });
  console.log(types, averageEuis);
  return {
    types,
    averageEuis,
  }
}

module.exports = { GetAvgEuis, GetBuildings, CountBuildings }