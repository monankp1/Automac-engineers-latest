import { type } from "@testing-library/user-event/dist/type";
import { useState, useEffect } from "react";

const CalibrationTable = ({ percentageValues, calibrationData, setCalibrationData }) => {

  // Update calibration data when percentageValues change
  useEffect(() => {
    setCalibrationData((prevData) =>
      prevData.map((row) => {
        let newReading;
        switch (row.ideal) {
          case "0%":
            newReading =
              percentageValues.zero !== undefined
                ? percentageValues.zero.toString()
                : "0"; // Use toString() for string representation
            break;
          case "25%":
            newReading =
              percentageValues.twentyFive !== undefined
                ? percentageValues.twentyFive.toString()
                : "";
            break;
          case "50%":
            newReading =
              percentageValues.fifty !== undefined
                ? percentageValues.fifty.toString()
                : "";
            break;
          case "75%":
            newReading =
              percentageValues.seventyFive !== undefined
                ? percentageValues.seventyFive.toString()
                : "";
            break;
          case "100%":
            newReading =
              percentageValues.hundred !== undefined
                ? percentageValues.hundred.toString()
                : "";
            break;
          default:
            newReading = row.reading;
        }
        return { ...row, reading: newReading || "" };
      })
    );
  }, [percentageValues]);

  const handleChange = (e, id, field) => {
    const updatedData = calibrationData.map((row) => {
      if (row.id === id) {
        const newValue = e.target.value;

        let upDiff = row.upDiff;
        let downDiff = row.downDiff;
        let upAccuracy = row.upAccuracy;
        let downAccuracy = row.downAccuracy;

        const idealValue = parseFloat(row.reading) || 0;

        if (field === "upReading") {
          const upReadingValue = parseFloat(newValue) || 0;
          upDiff = upReadingValue - idealValue;
          //Accuraccy formula as per the internet
          // upAccuracy = idealValue
          //   ? (1 - Math.abs(upDiff) / Math.abs(idealValue)) * 100
          //   : "";

          upAccuracy = idealValue === 0 ? 0 : upDiff / idealValue;
        } else if (field === "downReading") {
          const downReadingValue = newValue || 0;
          downDiff = downReadingValue - idealValue;
          //Accuraccy formula as per the internet
          // downAccuracy = idealValue
          // ? (1 - Math.abs(downDiff) / Math.abs(idealValue)) * 100
          // : "";
          downAccuracy = idealValue === 0 ? 0 : downDiff / idealValue;
        }

        return {
          ...row,
          [field]: newValue,
          upDiff,
          downDiff,
          upAccuracy,
          downAccuracy,
        };
      }
      return row;
    });

    setCalibrationData(updatedData);
  };

  return (
    <div className="m-4">
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-400 w-full max-w-4xl text-sm">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1">Sr. No.</th>
              <th className="border border-gray-400 px-2 py-1" colSpan="2">
                Ideal Reading
              </th>
              <th className="border border-gray-400 px-2 py-1" colSpan="2">
                Instrument Reading
              </th>
              <th className="border border-gray-400 px-2 py-1" colSpan="2">
                Diff.
              </th>
              <th className="border border-gray-400 px-2 py-1" colSpan="2">
                Accuracy in %
              </th>
              <th className="border border-gray-400 px-2 py-1" colSpan="2">
                Output (mA)
              </th>
              <th className="border border-gray-400 px-2 py-1">Remark</th>
            </tr>
            <tr>
              <th className="border border-gray-400 px-2 py-1"></th>
              <th className="border border-gray-400 px-2 py-1">Reading</th>
              <th className="border border-gray-400 px-2 py-1">%</th>
              <th className="border border-gray-400 px-2 py-1">UP</th>
              <th className="border border-gray-400 px-2 py-1">Down</th>
              <th className="border border-gray-400 px-2 py-1">UP</th>
              <th className="border border-gray-400 px-2 py-1">Down</th>
              <th className="border border-gray-400 px-2 py-1">UP</th>
              <th className="border border-gray-400 px-2 py-1">Down</th>
              <th className="border border-gray-400 px-2 py-1">UP</th>
              <th className="border border-gray-400 px-2 py-1">Down</th>
              <th className="border border-gray-400 px-2 py-1"></th>
            </tr>
          </thead>
          <tbody>
            {calibrationData.map((row) => (
              <tr key={row.id}>
                <td className="border border-gray-400 px-2 py-1">{row.id}</td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    readOnly
                    value={row.reading}
                    className="w-full px-1 py-1 text-sm"
                    onChange={(e) => handleChange(e, row.id, "reading")}
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  {row.ideal}
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.upReading}
                    className="w-full px-1 py-1 text-sm"
                    onChange={(e) => handleChange(e, row.id, "upReading")}
                    required
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.downReading}
                    className="w-full px-1 py-1 text-sm"
                    onChange={(e) => handleChange(e, row.id, "downReading")}
                    required
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.upDiff}
                    className="w-full px-1 py-1 text-sm"
                    readOnly
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.downDiff}
                    className="w-full px-1 py-1 text-sm"
                    readOnly
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.upAccuracy}
                    className="w-full px-1 py-1 text-sm"
                    readOnly
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.downAccuracy}
                    className="w-full px-1 py-1 text-sm"
                    readOnly
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.upOutput}
                    className="w-full px-1 py-1 text-sm"
                    onChange={(e) => handleChange(e, row.id, "upOutput")}
                    required
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <input
                    type="text"
                    value={row.downOutput}
                    className="w-full px-1 py-1 text-sm"
                    onChange={(e) => handleChange(e, row.id, "downOutput")}
                    required
                  />
                </td>
                <td className="border border-gray-400 px-2 py-1">
                  <textarea
                    value={row.remark}
                    className="w-full px-1 py-1 text-sm"
                    onChange={(e) => handleChange(e, row.id, "remark")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalibrationTable;
