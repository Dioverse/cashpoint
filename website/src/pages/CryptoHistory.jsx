import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Topnav from "../components/Topnav";
import HistoryLink from "../components/HistoryLink";

export default function CryptoHistory() {
  return (
    <>
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                {/* Menu */}
                    <Navbar />
                {/* / Menu */}

                {/* Layout container */}
                <div className="layout-page">
                    {/* Navbar */}

                    <Topnav />

                    {/* / Navbar */}

                    {/* Content wrapper */}
                    <div className="content-wrapper">
                        {/* Content */}

                        <div className="container-xxl flex-grow-1 container-p-y">

                            <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Home /History</span> / Airtime</h4>
                            
                            <div className="row">
                                <div className="col-lg-12 mb-4 order-0">
                                    <HistoryLink />
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="mb-0">Filter History</h5>

                                            <div className="card-header-actions col-4">
                                                <select className="form-select">
                                                    <option value="">All</option>
                                                    <option value="btc">BTC</option>
                                                    <option value="usdt">USDT</option>
                                                </select>
                                            </div>

                                                                                       
                                        </div>
                                        <div className="d-flex align-items-end row">
                                            <div className="table-responsive text-nowrap">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                        <th width="50">#</th>
                                                        <th>Ref</th>
                                                        <th>User</th>
                                                        <th>Chain</th>
                                                        <th>Type</th>
                                                        <th>Wallet Add.</th>
                                                        <th>Quantity</th>
                                                        <th>Amount</th>
                                                        <th>Naira</th>
                                                        <th>Status</th>
                                                        <th>Date</th>
                                                        <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="table-border-bottom-0">
                                                        <tr>
                                                            <td>1</td>
                                                            <td>983798390390</td>
                                                            <td>adioridwan</td>
                                                            <td><a>BTC</a> </td>
                                                            <td>sell</td>
                                                            <td>300</td>
                                                            <td>500.00</td>
                                                            <td>60,000</td>
                                                            <td>500</td>
                                                            <td><span class="badge bg-label-primary me-1">Active</span></td>
                                                            <td> 2025-01-01</td>
                                                            <td>
                                                                <div class="dropdown">
                                                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                                    <i class="bx bx-dots-vertical-rounded"></i>
                                                                </button>
                                                                <div class="dropdown-menu">
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-edit-alt me-1"></i> approved</a
                                                                    >
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-trash me-1"></i> reject</a
                                                                    >
                                                                </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
                                                            <td>983798390390</td>
                                                            <td>olawale</td>
                                                            <td><a>GLO</a> </td>
                                                            <td>07035743427</td>
                                                            <td>700</td>
                                                            <td>500</td>
                                                            <td>500</td>
                                                            <td>2%</td>
                                                            <td><span class="badge bg-label-primary me-1">Active</span></td>
                                                            <td> 2025-01-01</td>
                                                            <td>
                                                                <div class="dropdown">
                                                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                                    <i class="bx bx-dots-vertical-rounded"></i>
                                                                </button>
                                                                <div class="dropdown-menu">
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-edit-alt me-1"></i> approved</a
                                                                    >
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-trash me-1"></i> reject</a
                                                                    >
                                                                </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* / Content */}

                        {/* Footer */}
                        <Footer/>
                        {/* / Footer */}

                        <div className="content-backdrop fade"></div>
                    </div>
                    {/* Content wrapper */}
                </div>
                {/* / Layout page */}
            </div>
        </div>
    </>
  );
}
