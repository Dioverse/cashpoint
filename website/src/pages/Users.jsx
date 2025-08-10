import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Topnav from "../components/Topnav";

export default function Users() {
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
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                        <th width="50">#</th>
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
                                                        <tr>
                                                            <td>1</td>
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
                                                                    </li><a>Angular Project</a>
                                                                </ul>
                                                                
                                                            </td>
                                                            <td>
                                                                xyz@gmail.com
                                                            </td>
                                                            <td>07035743427</td>
                                                            <td>#25,000</td>
                                                            <td>$30.00</td>
                                                            <td><span class="badge bg-label-primary me-1">Admin</span></td>
                                                            <td><span class="badge bg-label-primary me-1">Active</span></td>
                                                            <td>
                                                                <div class="dropdown">
                                                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                                    <i class="bx bx-dots-vertical-rounded"></i>
                                                                </button>
                                                                <div class="dropdown-menu">
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-edit-alt me-1"></i> Edit</a
                                                                    >
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-trash me-1"></i> Delete</a
                                                                    >
                                                                </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>2</td>
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
                                                                    </li><a>Angular Project</a>
                                                                </ul>
                                                                
                                                            </td>
                                                            <td>
                                                                xyz@gmail.com
                                                            </td>
                                                            <td>07035743427</td>
                                                            <td>#25,000</td>
                                                            <td>$30.00</td>
                                                            <td><span class="badge bg-label-primary me-1">Admin</span></td>
                                                            <td><span class="badge bg-label-primary me-1">Active</span></td>
                                                            <td>
                                                                <div class="dropdown">
                                                                <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                                    <i class="bx bx-dots-vertical-rounded"></i>
                                                                </button>
                                                                <div class="dropdown-menu">
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-edit-alt me-1"></i> Edit</a
                                                                    >
                                                                    <a class="dropdown-item" href="javascript:void(0);"
                                                                    ><i class="bx bx-trash me-1"></i> Delete</a
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
