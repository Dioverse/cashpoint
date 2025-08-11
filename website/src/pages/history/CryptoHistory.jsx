import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Topnav from "../../components/Topnav";
import HistoryLink from "../../components/HistoryLink";
import { getRequest } from "../../services/apiServices";

export default function CryptoHistory() {
    const [datas, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchData(page);
    }, [page]);
    
    const fetchData = async (pageNum) => {
        setLoading(true);
        try {
            const res = await getRequest(`/histories/crypto?page=${pageNum}&limit=${pageSize}`);
            setData(res.data?.results?.Data?.data || []);
            setTotalPages(res.data.results.Data.last_page);
        } catch (err) {
            console.error("Failed to fetch plan:", err);
        } finally {
            setLoading(false);
        }
    };
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

                            <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Home /History</span> / Airtime</h4>
                            
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
                                                    <tbody className="table-border-bottom-0">
                                                        {datas.map((data, index) => (
                                                        <tr key={index}>
                                                            <td>{(page-1) * pageSize + index + 1}</td>
                                                            <td>{data.transaction_hash}</td>
                                                            <td>{data.user.username}</td>
                                                            <td><a>{data.crypto.name}</a> </td>
                                                            <td>{data.type}</td>
                                                            <td>{data.wallet_address}</td>
                                                            <td>{data.amount_crypto}</td>
                                                            <td>${data.amount}</td>
                                                            <td>₦{data.naira_equivalent}</td>
                                                            
                                                            <td>
                                                                <span className={`badge ${data.status === 'success' ? "bg-label-success" : "bg-label-danger"}`}>
                                                                    {data.status === 'success' ? "Active" : "Inactive"}
                                                                </span>
                                                            </td>
                                                            <td> {data.created_at.slice(0, 10)}</td>
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
                        {/* / Content */}
                        {/* Pagination */}
                        <nav className="mt-3">
                            <ul className="pagination justify-content-center">
                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setPage(page - 1)}>Previous</button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => setPage(page + 1)}>Next</button>
                            </li>
                            </ul>
                        </nav>
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
