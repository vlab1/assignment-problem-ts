import React, { useState } from "react";
import { useHttp } from "../../../hooks/http.hook";
import "./Main.scss";

const Main = () => {
  const [data, setData] = useState([]);
  const [columnCount, setColumnCount] = useState(null);
  const [rowCount, setRowCount] = useState(null);
  const { loading, request } = useHttp();
  const [analysisData, setAnalysisData] = useState({});
  const [analysisDataTable, setAnalysisDataTable] = useState([]);

  const handleAnalysisData = async () => {
    try {
      const saveData = {
        columns: [],
        rows: [],
        data: [],
      };
      const columns = data[0].slice(1);
      let rows = [];
      data.slice(1).map((row, rowIndex) => rows.push(row[0]));
      let mainData = data.slice(1);
      mainData.map((row, rowIndex) => (mainData[rowIndex] = row.slice(1)));
      mainData.map((array, i) =>
        array.map((item, j) => (mainData[i][j] = Number(item)))
      );
      saveData.columns = columns;
      saveData.rows = rows;
      saveData.data = mainData;
      await request("/api/analysis/start", "POST", {
        ...saveData,
      }).then((res) => {
        setAnalysisData(res.data);
        setAnalysisDataTable(() => {
          let currentData = [];

          for (let i = 0; i < data.length; i++) {
            let array = [];
            for (let j = 0; j < data[i].length; j++) {
              array.push(data[i][j]);
            }
            currentData.push(array);
          }

          for (let i = 0; i < currentData.length; i++) {
            if (i === 0) {
              currentData[i].push("y");
            } else {
              currentData[i].push("1");
            }
            if (i + 1 === currentData.length) {
              let array = [];
              for (let j = 0; j < currentData[i].length; j++) {
                if (j === 0) {
                  array.push("z");
                } else if (j !== currentData[i].length - 1) {
                  array.push("1");
                } else {
                  array.push("Σ = " + res.data.maxTotalDamage);
                }
              }
              currentData.push(array);
              break;
            }
          }
          return currentData;
        });
      });
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleDownloadData = async () => {
    try {
      await request("/api/analysis/find").then((res) => {
        setData(res.data);
      });
      setAnalysisDataTable([]);
      setAnalysisData({});
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleClearData = async () => {
    try {
      setData([]);
      setAnalysisDataTable([]);
      setAnalysisData({});
    } catch (e) {
      throw new Error("Error");
    }
  };

  const handleSaveData = async () => {
    try {
      setAnalysisDataTable([]);
      setAnalysisData({});
      const saveData = {
        columns: [],
        rows: [],
        data: [],
      };
      if (data.length > 0) {
        const columns = data[0].slice(1);
        let rows = [];
        data.slice(1).map((row, rowIndex) => rows.push(row[0]));
        let mainData = data.slice(1);
        mainData.map((row, rowIndex) => (mainData[rowIndex] = row.slice(1)));
        mainData.map((array, i) =>
          array.map((item, j) => (mainData[i][j] = Number(item)))
        );
        saveData.columns = columns;
        saveData.rows = rows;
        saveData.data = mainData;

        let bool = true;
        let count = 0;

        for (let i = 0; i < columns.length; i++) {
          if (columns[i] === "" || columns[i] === "" || columns[i] === null) {
            count++;
          }
        }
        for (let i = 0; i < rows.length; i++) {
          if (rows[i] === "" || rows[i] === "" || rows[i] === null) {
            count++;
          }
        }
        for (let i = 0; i < mainData.length; i++) {
          for (let j = 0; j < mainData[i].length; j++) {
            if (mainData[i][j] === 0) {
              count++;
            }
          }
        }
        if (
          count ===
          rows.length + columns.length + columns.length * rows.length
        ) {
          bool = false;
        }
        if (bool) {
          await request("/api/analysis/save", "POST", {
            ...saveData,
          });
        } else {
          await request("/api/analysis/delete", "DELETE", {
            ...saveData,
          });
        }
      } else {
        await request("/api/analysis/delete", "DELETE", {
          columns: [""],
          rows: [""],
          data: [[0]],
        });
      }
    } catch (e) {
      throw new Error("Error");
    }
  };

  const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  const handleColumnCountChange = (event) => {
    console.log(data);
    setColumnCount(parseInt(event.target.value));
    setRowCount(parseInt(event.target.value));
  };

  const handleCreateTable = () => {
    const newData = [];
    const topRow = [""];
    for (let i = 0; i < columnCount; i++) {
      topRow.push("");
    }
    newData.push(topRow);
    for (let i = 0; i < rowCount; i++) {
      const newRow = [""];
      for (let j = 0; j < columnCount; j++) {
        newRow.push("");
      }
      newData.push(newRow);
    }
    setData(newData);
    setAnalysisDataTable([]);
    setAnalysisData({});
  };

  const handleCellChange = (event, rowIndex, columnIndex) => {
    const value = event.target.value;
    setData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex][columnIndex] = value;
      return newData;
    });
    setAnalysisDataTable([]);
    setAnalysisData({});
  };

  const handleGenerateData = () => {
    const newData = [];
    const topRow = [""];
    for (let i = 0; i < columnCount; i++) {
      topRow.push("Entity " + (i + 1));
    }
    newData.push(topRow);
    for (let i = 0; i < rowCount; i++) {
      const newRow = ["Point " + (i + 1)];

      for (let j = 0; j < columnCount; j++) {
        newRow.push(randomIntFromInterval(1, 25) + "");
      }
      newData.push(newRow);
    }
    setData(newData);
    setAnalysisDataTable([]);
    setAnalysisData({});
  };

  return (
    <div>
      <div className="menu">
        <div className="field">
          <input
            value={columnCount}
            onChange={handleColumnCountChange} placeholder="Matrix size"
          ></input>
        </div>

        <div className="buttons">
          <button
            disabled={loading}
            className="action-button"
            onClick={handleCreateTable}
          >
            create
          </button>
          <button
            disabled={loading}
            className="action-button"
            onClick={handleGenerateData}
          >
            generate
          </button>

          <button
            disabled={loading}
            className="action-button"
            onClick={handleAnalysisData}
          >
            solve
          </button>
        </div>
        <div className="buttons">
          <button
            disabled={loading}
            className="action-button"
            onClick={handleSaveData}
          >
            save
          </button>
          <button
            disabled={loading}
            className="action-button"
            onClick={handleDownloadData}
          >
            download
          </button>
          <button
            disabled={loading}
            className="action-button"
            onClick={handleClearData}
          >
            clear
          </button>
        </div>
      </div>
      {/* <div style={analysisDataTable.length > 0 ? { display: "none" } : { display: "block" }}> */}
      <table className="table-input">
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <td
                  key={columnIndex}
                  style={
                    (rowIndex === 0 || columnIndex === 0) &&
                    !(rowIndex === 0 && columnIndex === 0)
                      ? { background: "#efefef" }
                      : { background: "white" }
                  }
                >
                  <input
                    disabled={rowIndex === 0 && columnIndex === 0}
                    type="text"
                    value={cell}
                    onChange={(event) =>
                      handleCellChange(event, rowIndex, columnIndex)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* </div> */}
      <div
        style={loading ? { display: "block" } : { display: "none" }}
        className="loader"
      ></div>
      {analysisData?.result?.length > 0 && analysisDataTable.length > 0 && (
        <table className="table-analysis">
          <tbody>
            {analysisDataTable.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => {
                  const choice = analysisData.result.filter(
                    (item) =>
                      (item.row === rowIndex - 1) &
                      (item.column === columnIndex - 1)
                  ).length;
                  return (
                    <td
                      key={columnIndex}
                      style={
                        choice === 1
                          ? { background: "#afffbb" }
                          : { background: "white" } &&
                            (rowIndex === 0 || columnIndex === 0) &&
                            !(rowIndex === 0 && columnIndex === 0)
                          ? { background: "#efefef" }
                          : { background: "white" }
                      }
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* <div
        style={loading ? { display: "block" } : { display: "none" }}
        className="loader"
      ></div> */}
    </div>
  );
};

export default Main;
