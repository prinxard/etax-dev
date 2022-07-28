import Widget from "../widget";
import { formatNumber } from "../../functions/numbers";
import * as Icons from '../Icons/index';
import Widget1 from "../dashboard/widget-1";
import dateformat from "dateformat";
import Link from 'next/link';
import { useRef } from "react";
import setAuthToken from "../../functions/setAuthToken";
import { CoatOfArms, KgirsLogo, KgirsLogo2, KogiGov, Signature } from "../Images/Images";
import ReactToPrint from "react-to-print";
import QRCode from "react-qr-code";

const fields = [
  {
    name: "File Ref",
    key: "file_ref",
  },
  {
    name: "KGTIN",
    key: "tp_id",
  },
  {
    name: "Name",
    key: "taxpayer_name",
  },
  {
    name: "Year 1 tax",
    key: "taxYr_1",
  },
  {
    name: "Year 2 tax",
    key: "taxYr_2",
  },
  {
    name: "Year 3 tax",
    key: "taxYr_3",
  },
  {
    name: "Station",
    key: "tax_station",
  },
  {
    name: "Create Time",
    key: "crt_time",
  },
  {
    name: "Status",
    key: "status",
  },

];

export const ViewPayeTableTCC = ({ tccData }) => {
  let items = tccData;

  return (
    <>
      <Widget>
        <table className="table divide-y">
          <thead>
            <tr className="">
              {fields.map((field, i) => (
                <th key={i} className="">
                  {field.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((tccData, i) => (
              <tr key={i} className="">
                {fields.map((field, j) => (
                  <td key={j} className="">
                    {/* {remittance[field.key]} */}
                    <Link href={`/view/paye-tcc/${tccData.id}`}>
                      <a className="hover:text-blue-500">
                        {tccData[field.key]}
                      </a>
                    </Link>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-16"></div>
        <hr />
      </Widget>
    </>
  );
};

export const PrintSinglePayeTcc = ({
  tccID,
  PayeTccData
}) => {

  const componentRef = useRef();

  let picUpload = ""
  let signature = ""
 
  let printPrintTime


  PayeTccData.forEach((ind, i) => {
    picUpload = ind.passport.data
  })
  PayeTccData.forEach((ind, i) => {
    signature = ind.signature.data
  })

  console.log("PayeTccData", PayeTccData);
  console.log("picUpload", picUpload);

  const base64StringPic = Buffer.from(picUpload).toString('base64')
  const base64StringSig = Buffer.from(signature).toString('base64')

  PayeTccData.forEach((ind, i) => {
    printPrintTime = ind.aprvPrint_time
  })

  if (printPrintTime === undefined) {
    printPrintTime = new Date()
  } else {
    printPrintTime = printPrintTime
  }


  let date = printPrintTime
  let due_date = new Date(date)
  due_date.setDate(due_date.getDate() + 365);
  let expiry = dateformat(due_date, "dd mmm yyyy")

  let Issdate = new Date()
  let Issdue_date = new Date(Issdate)
  let dateIssue = dateformat(Issdue_date, "dd mmm yyyy")


  setAuthToken();
  let ChangePrint = (e) => {
    e.preventDefault()
    let statusObj = {
      id: tccID,
      status: "Printed"
    }
    try {
      let res = axios.post(`${url.BASE_URL}forma/tcc-status`, statusObj);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <>
      <div className="m-3 flex justify-end">
        <div onClick={ChangePrint}>
          <ReactToPrint
            pageStyle="@page { size: 7.5in 13in  }"
            trigger={() => <button className="btn w-32 bg-green-600 btn-default text-white
            btn-outlined bg-transparent rounded-md"
              type="submit"
            >
              Print
            </button>}
            content={() => componentRef.current}
          />
        </div>

      </div>
      {PayeTccData.map((ind, i) => (

        <section>
          <div ref={componentRef}>
            <div className="flex justify-around">
              <div>

                <div className="flex mb-8">
                  <KgirsLogo />
                  <p className="self-center w-48 font-bold">KOGI STATE INTERNAL REVENUE SERVICE</p>
                </div>

                <div className="flex justify-end">
                  <p className="border font-bold p-2 text-center w-64">{`File No - ${ind.file_ref}`}</p>
                </div>

                <div>
                  <div className="flex justify-between my-3">
                    <div className="flex">
                      <div>
                        <img
                          src={`data:image/png;base64,${base64StringPic}`}
                          alt=""
                          className="rounded h-16 w-16"
                        />
                      </div>
                      <div className="self-end ml-2">
                        <img
                          src={`data:image/png;base64,${base64StringSig}`}
                          alt=""
                          className="rounded h-10 w-24"
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <CoatOfArms />
                      <p className="border-r-2 ml-2 border-black h-8 self-center"></p>
                      <KogiGov />
                    </div>
                  </div>
                  <p> <span className="font-bold">1.</span> This is to Verify that <span className="font-bold">{ind.taxpayer_name}</span></p>
                  <div>
                    <p>fully paid his/her Personal Income Tax for the past years, that is: <span>
                      {`${ind.assmtYr_2 !== "" ? `${ind.assmtYr_1},` : ind.assmtYr_1} ${ind.assmtYr_3 !== "" ? `${ind.assmtYr_2},` : ind.assmtYr_2} ${ind.assmtYr_3}`}
                    </span>
                    </p>
                  </div>
                </div>

                <div className="my-4">
                  <p><span className="font-bold">2.</span> Details of his/her assessments are as follows:</p>
                </div>
                <div className="flex justify-center mb-5">

                  <div>
                    <div>
                      <small className="leading-none block">TCC ID </small>
                      <small className="font-bold">{ind.ref}</small>
                    </div>

                    <div className="mt-1">
                      <small className="leading-none block">TAX ID </small>
                      <small className="font-bold">{ind.tp_id}</small>
                    </div>

                    <div className="mt-1">
                      <small className="leading-none block">DATE OF ISSUE </small>
                      <small className="font-bold">{dateIssue}</small>
                    </div>

                    <div className="mt-1">
                      <small className="leading-none block">Tax OFFICE</small>
                      <small className="font-bold">{ind.tax_station}</small>
                    </div>
                  </div>


                  <div className="w-10"></div>
                  <div>
                    <table className="table divide-y mb-4 striped">
                      <thead >
                        <tr style={{ backgroundColor: "#d3fbc6" }}>
                        
                          <th>
                            Tax Year
                          </th>
                          <th className="">
                            Assessed Income
                          </th>
                          <th className="">
                            Tax Paid
                          </th>
                          <th className="">
                            Assessment Type
                          </th>
                        </tr>
                      </thead>

                      <tbody >
                        {ind.taxYr_1 === "" || ind.taxYr_1 === null ? "" :
                          <tr>
                          
                            <td className="">
                              <p className="font-bold">{ind.assmtYr_1}</p>
                            </td>
                            <td className="">
                              <p className="font-bold"> {formatNumber(ind.incYr_1)} </p>
                            </td>
                            <td className="">
                              <p className="font-bold">{formatNumber(ind.taxYr_1)}</p>
                            </td>
                            <td className="">
                              <p>PAYE</p>
                            </td>
                          </tr>
                        }
                        {ind.taxYr_2 === "" || ind.taxYr_2 === null ? "" :
                          <tr>
                         
                            <td className="">
                              <p className="font-bold">{ind.assmtYr_2}</p>
                            </td>
                            <td className="">
                              <p className="font-bold"> {formatNumber(ind.incYr_2)} </p>
                            </td>
                            <td className="">
                              <p className="font-bold">{formatNumber(ind.taxYr_2)}</p>
                            </td>
                            <td className="">
                              <p>PAYE</p>
                            </td>

                          </tr>

                        }
                        {ind.taxYr_3 === "" === "" || ind.taxYr_3 === null ? "" :
                          <tr>
                          
                            <td className="">
                              <p className="font-bold">{ind.assmtYr_3}</p>
                            </td>
                            <td className="">
                              <p className="font-bold"> {formatNumber(ind.incYr_3)} </p>
                            </td>
                            <td className="">
                              <p className="font-bold">{formatNumber(ind.taxYr_2)}</p>
                            </td>
                            <td className="">
                              <p>PAYE</p>
                            </td>

                          </tr>

                        }

                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <p className="mb-2"><span className="font-bold">3.</span> His/her known source(s) of income are: <span>Employment, Trade/Professional</span> </p>
                  <p><span className="font-bold">4.</span> This certificate expires on: <span>{expiry}</span> </p>
                </div>




                <div className="flex justify-between mt-2">
                  <div>
                    <QRCode
                      value={`https://irs.kg.gov.ng/verify/fetch_tcc.php?ref=${ind.ref}`}
                      size={120}
                    />
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="flex flex-col">
                      <Signature />
                      <hr />
                      <p className="font-bold text-center">Sule Salihu Enehe</p>
                      <p className="font-bold text-center">Ag. Executive Chairman</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>


          </div>

        </section>
      ))}
    </>
  );
};