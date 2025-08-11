import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Topnav from "../../components/Topnav";
import NavLink from "../../components/NavLink";
import { getRequest } from "../../services/apiServices";

export default function AirtimePricing() {
  const [datas, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []); // ✅ prevents infinite requests

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getRequest(`/pricings/airtime/`);
      setData(res.data?.results?.Data || []);
    } catch (err) {
      console.error("Failed to fetch airtime pricing data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Navbar />
        <div className="layout-page">
          <Topnav />
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
              <h4 className="fw-bold py-3 mb-4">
                <span className="text-muted fw-light">Home / Pricing</span> / Airtime
              </h4>

              <div className="row">
                <div className="col-lg-12 mb-4 order-0">
                  <NavLink />
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Filter Pricing Plans</h5>

                      <div className="card-header-actions float-end">
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#basicModal"
                        >
                          Add Plan
                        </button>
                      </div>
                    </div>

                    <div className="d-flex align-items-end row">
                      <div className="table-responsive text-nowrap">
                        {loading ? (
                          <div className="text-center p-4">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                              style={{ width: "3rem", height: "3rem" }}
                            >
                              <span className="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        ) : (
                          <table className="table">
                            <thead>
                              <tr>
                                <th width="50">#</th>
                                <th>Network</th>
                                <th>Status</th>
                                <th>Percentage</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody className="table-border-bottom-0">
                              {datas.map((data, index) => (
                                <tr key={data.id}>
                                  <td>{index + 1}</td>
                                  <td>{data.network.name}</td>
                                  <td>
                                    <span className="badge bg-label-primary me-1">Active</span>
                                  </td>
                                  <td>{data.percentage}%</td>
                                  <td>
                                    <div className="dropdown">
                                      <button
                                        type="button"
                                        className="btn p-0 dropdown-toggle hide-arrow"
                                        data-bs-toggle="dropdown"
                                      >
                                        <i className="bx bx-dots-vertical-rounded"></i>
                                      </button>
                                      <div className="dropdown-menu">
                                        <button className="dropdown-item">
                                          <i className="bx bx-edit-alt me-1"></i> Edit
                                        </button>
                                        <button className="dropdown-item">
                                          <i className="bx bx-trash me-1"></i> Delete
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
            <div className="content-backdrop fade"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
