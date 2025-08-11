import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Topnav from "../components/Topnav";
import axios from "axios";
import { getRequest } from "../services/apiServices";

export default function Users() {
    const url = 'http://127.0.0.1:8006/api/admin';
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(()=>{
        fetchUsers(page);
    }, [page]);

    const fetchUsers = async (pageNum) => {
        setLoading(true);
        try {
            const res = await getRequest(`${url}/users?page=${pageNum}&limit=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            // getRequest(`${url}/users?page=${pageNum}&limit=${pageSize}`).then(res => {
            //     console.log(res.data);
            // });
            console.log("Fetched users:", res.data.users);
            setUsers(res.data.users.data);
            setTotalPages(res.users.total);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId) => {
        try {
            await axios.patch(`${url}/users/${userId}/toggleStatus`);
            fetchUsers(page);
        } catch (err) {
            console.error("Failed to toggle user status:", err);
        }
    };

    const approveKyc = async (userId) => {
        try {
            await axios.patch(`${url}/users/${userId}/approveKyc`);
            fetchUsers(page);
        } catch (err) {
            console.error("Failed to approve KYC:", err);
        }
    };

    const rejectKyc = async (userId) => {
        try {
            await axios.patch(`${url}/users/${userId}/rejectKyc`);
            fetchUsers(page);
        } catch (err) {
            console.error("Failed to reject KYC:", err);
        }
    };

    const fundWallet = async (userId, currency) => {
        const amount = prompt(`Enter amount to fund wallet (${currency}):`);
        if (!amount) return;
        try {
            await axios.post(`${url}/users/${userId}/fundWallet`, { amount, currency });
            fetchUsers(page);
        } catch (err) {
            console.error("Error funding wallet:", err);
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

                            <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Home /</span> User Management</h4>
                            
                            <div className="row">
                                <div className="col-lg-12 mb-4 order-0">
                                    <div className="card">
                                        <div className="d-flex align-items-end row">
                                            <div className="table-responsive text-nowrap">
                                                {loading ? (
                                                    <div className="text-center p-4">
                                                        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                                                            <span className="visually-hidden">Loading...</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                        <th>#</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Phone</th>
                                                        <th>Naira</th>
                                                        <th>USD</th>
                                                        <th>Role</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody class="table-border-bottom-0">
                                                        {users.map((user, index) => (
                                                        <tr>
                                                            <td>{(page-1) * pageSize + index + 1}</td>
                                                            <td>
                                                                {/* <i class="fab fa-angular fa-lg text-danger me-3"></i>  */}
                                                                <ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                                                    <li
                                                                        data-bs-toggle="tooltip"
                                                                        data-popup="tooltip-custom"
                                                                        data-bs-placement="top"
                                                                        class="avatar avatar-xs pull-up"
                                                                        title="Lilian Fuller"
                                                                    >
                                                                        <img src="../assets/img/avatars/5.png" alt="Avatar" class="rounded-circle" />
                                                                    </li><a className="ms-2">{user.lastName + ' ' + user.firstName + ' ' + user.middleName}</a>
                                                                </ul>
                                                                
                                                            </td>
                                                            <td>{user.email} </td>
                                                            <td>{user.phone}</td>
                                                            <td>₦{user.wallet_naira?.toLocaleString()}</td>
                                                            <td>${user.wallet_usd?.toLocaleString()}</td>
                                                            <td><span class="badge bg-label-primary me-1">{user.role}</span></td>
                                                            <td>
                                                                <span className={`badge ${user.status === "active" ? "bg-label-success" : "bg-label-danger"}`}>
                                                                    {user.status}
                                                                </span>
                                                            </td>
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
                                                                    <a className="dropdown-item" href="#" onClick={() => toggleUserStatus(user.id)}>
                                                                        <i className="bx bx-toggle-left me-1"></i> Toggle Status
                                                                    </a>
                                                                    <a className="dropdown-item" href={`/admin/users/${user.id}`}>
                                                                        <i className="bx bx-user me-1"></i> View User & KYC
                                                                    </a>
                                                                    <a className="dropdown-item" href="#" onClick={() => approveKyc(user.id)}>
                                                                        <i className="bx bx-check-circle me-1"></i> Approve KYC
                                                                    </a>
                                                                    <a className="dropdown-item" href="#" onClick={() => rejectKyc(user.id)}>
                                                                        <i className="bx bx-x-circle me-1"></i> Reject KYC
                                                                    </a>
                                                                    <a className="dropdown-item" href="#" onClick={() => fundWallet(user.id, "naira")}>
                                                                        <i className="bx bx-wallet me-1"></i> Fund Wallet (₦)
                                                                    </a>
                                                                    <a className="dropdown-item" href="#" onClick={() => fundWallet(user.id, "usd")}>
                                                                        <i className="bx bx-wallet me-1"></i> Fund Wallet ($)
                                                                    </a>
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
