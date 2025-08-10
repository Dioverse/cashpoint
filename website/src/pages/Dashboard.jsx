import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Topnav from "../components/Topnav";

export default function Dashboard() {
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
                        <div className="row">
                            <div className="col-lg-8 mb-4 order-0">
                            <div className="card">
                                <div className="d-flex align-items-end row">
                                <div className="col-sm-7">
                                    <div className="card-body">
                                    <h5 className="card-title text-primary">Congratulations John! 🎉</h5>
                                    <p className="mb-4">
                                        You have done <span className="fw-bold">72%</span> more sales today. Check your new badge in
                                        your profile.
                                    </p>

                                    <a href="javascript:;" className="btn btn-sm btn-outline-primary">View Badges</a>
                                    </div>
                                </div>
                                <div className="col-sm-5 text-center text-sm-left">
                                    <div className="card-body pb-0 px-0 px-md-4">
                                    <img
                                        src="../assets/img/illustrations/man-with-laptop-light.png"
                                        height="140"
                                        alt="View Badge User"
                                        data-app-dark-img="illustrations/man-with-laptop-dark.png"
                                        data-app-light-img="illustrations/man-with-laptop-light.png"
                                    />
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            <div className="col-lg-4 col-md-4 order-1">
                            <div className="row">
                                <div className="col-lg-6 col-md-12 col-6 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                        <img
                                            src="../assets/img/icons/unicons/chart-success.png"
                                            alt="chart success"
                                            className="rounded"
                                        />
                                        </div>
                                        <div className="dropdown">
                                        <button
                                            className="btn p-0"
                                            type="button"
                                            id="cardOpt3"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i className="bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt3">
                                            <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                            <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                        </div>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Profit</span>
                                    <h3 className="card-title mb-2">$12,628</h3>
                                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +72.80%</small>
                                    </div>
                                </div>
                                </div>
                                <div className="col-lg-6 col-md-12 col-6 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                        <img
                                            src="../assets/img/icons/unicons/wallet-info.png"
                                            alt="Credit Card"
                                            className="rounded"
                                        />
                                        </div>
                                        <div className="dropdown">
                                        <button
                                            className="btn p-0"
                                            type="button"
                                            id="cardOpt6"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i className="bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt6">
                                            <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                            <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                        </div>
                                        </div>
                                    </div>
                                    <span>Sales</span>
                                    <h3 className="card-title text-nowrap mb-1">$4,679</h3>
                                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.42%</small>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/* Total Revenue */}
                            <div className="col-12 col-lg-8 order-2 order-md-3 order-lg-2 mb-4">
                            <div className="card">
                                <div className="row row-bordered g-0">
                                <div className="col-md-8">
                                    <h5 className="card-header m-0 me-2 pb-3">Total Revenue</h5>
                                    <div id="totalRevenueChart" className="px-2"></div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card-body">
                                    <div className="text-center">
                                        <div className="dropdown">
                                        <button
                                            className="btn btn-sm btn-outline-primary dropdown-toggle"
                                            type="button"
                                            id="growthReportId"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            2022
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="growthReportId">
                                            <a className="dropdown-item" href="javascript:void(0);">2021</a>
                                            <a className="dropdown-item" href="javascript:void(0);">2020</a>
                                            <a className="dropdown-item" href="javascript:void(0);">2019</a>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                    <div id="growthChart"></div>
                                    <div className="text-center fw-semibold pt-3 mb-2">62% Company Growth</div>

                                    <div className="d-flex px-xxl-4 px-lg-2 p-4 gap-xxl-3 gap-lg-1 gap-3 justify-content-between">
                                    <div className="d-flex">
                                        <div className="me-2">
                                        <span className="badge bg-label-primary p-2"><i className="bx bx-dollar text-primary"></i></span>
                                        </div>
                                        <div className="d-flex flex-column">
                                        <small>2022</small>
                                        <h6 className="mb-0">$32.5k</h6>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="me-2">
                                        <span className="badge bg-label-info p-2"><i className="bx bx-wallet text-info"></i></span>
                                        </div>
                                        <div className="d-flex flex-column">
                                        <small>2021</small>
                                        <h6 className="mb-0">$41.2k</h6>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                            {/*/ Total Revenue */}
                            <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
                            <div className="row">
                                <div className="col-6 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                        <img src="../assets/img/icons/unicons/paypal.png" alt="Credit Card" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                        <button
                                            className="btn p-0"
                                            type="button"
                                            id="cardOpt4"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i className="bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="cardOpt4">
                                            <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                            <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                        </div>
                                        </div>
                                    </div>
                                    <span className="d-block mb-1">Payments</span>
                                    <h3 className="card-title text-nowrap mb-2">$2,456</h3>
                                    <small className="text-danger fw-semibold"><i className="bx bx-down-arrow-alt"></i> -14.82%</small>
                                    </div>
                                </div>
                                </div>
                                <div className="col-6 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                    <div className="card-title d-flex align-items-start justify-content-between">
                                        <div className="avatar flex-shrink-0">
                                        <img src="../assets/img/icons/unicons/cc-primary.png" alt="Credit Card" className="rounded" />
                                        </div>
                                        <div className="dropdown">
                                        <button
                                            className="btn p-0"
                                            type="button"
                                            id="cardOpt1"
                                            data-bs-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            <i className="bx bx-dots-vertical-rounded"></i>
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="cardOpt1">
                                            <a className="dropdown-item" href="javascript:void(0);">View More</a>
                                            <a className="dropdown-item" href="javascript:void(0);">Delete</a>
                                        </div>
                                        </div>
                                    </div>
                                    <span className="fw-semibold d-block mb-1">Transactions</span>
                                    <h3 className="card-title mb-2">$14,857</h3>
                                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> +28.14%</small>
                                    </div>
                                </div>
                                </div>
                            
                            </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* Order Statistics */}
                            <div className="col-md-8 col-lg-8 col-xl-8 order-0 mb-4">
                                {/* <!-- Basic Bootstrap Table --> */}
                                    <div className="card">
                                    <h5 className="card-header">Recent Registrations</h5>
                                    <div className="table-responsive text-nowrap">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody class="table-border-bottom-0">
                                                <tr>
                                                    <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                                                    <td>Albert Cook</td>
                                                    <td>
                                                        <ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                                        <li
                                                            data-bs-toggle="tooltip"
                                                            data-popup="tooltip-custom"
                                                            data-bs-placement="top"
                                                            class="avatar avatar-xs pull-up"
                                                            title="Lilian Fuller"
                                                        >
                                                            <img src="../assets/img/avatars/5.png" alt="Avatar" class="rounded-circle" />
                                                        </li>
                                                        <li
                                                            data-bs-toggle="tooltip"
                                                            data-popup="tooltip-custom"
                                                            data-bs-placement="top"
                                                            class="avatar avatar-xs pull-up"
                                                            title="Sophia Wilkerson"
                                                        >
                                                            <img src="../assets/img/avatars/6.png" alt="Avatar" class="rounded-circle" />
                                                        </li>
                                                        <li
                                                            data-bs-toggle="tooltip"
                                                            data-popup="tooltip-custom"
                                                            data-bs-placement="top"
                                                            class="avatar avatar-xs pull-up"
                                                            title="Christina Parker"
                                                        >
                                                            <img src="../assets/img/avatars/7.png" alt="Avatar" class="rounded-circle" />
                                                        </li>
                                                        </ul>
                                                    </td>
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
                                                    <td><i class="fab fa-angular fa-lg text-danger me-3"></i> <strong>Angular Project</strong></td>
                                                    <td>Albert Cook</td>
                                                    <td>
                                                        <ul class="list-unstyled users-list m-0 avatar-group d-flex align-items-center">
                                                        <li
                                                            data-bs-toggle="tooltip"
                                                            data-popup="tooltip-custom"
                                                            data-bs-placement="top"
                                                            class="avatar avatar-xs pull-up"
                                                            title="Lilian Fuller"
                                                        >
                                                            <img src="../assets/img/avatars/5.png" alt="Avatar" class="rounded-circle" />
                                                        </li>
                                                        <li
                                                            data-bs-toggle="tooltip"
                                                            data-popup="tooltip-custom"
                                                            data-bs-placement="top"
                                                            class="avatar avatar-xs pull-up"
                                                            title="Sophia Wilkerson"
                                                        >
                                                            <img src="../assets/img/avatars/6.png" alt="Avatar" class="rounded-circle" />
                                                        </li>
                                                        <li
                                                            data-bs-toggle="tooltip"
                                                            data-popup="tooltip-custom"
                                                            data-bs-placement="top"
                                                            class="avatar avatar-xs pull-up"
                                                            title="Christina Parker"
                                                        >
                                                            <img src="../assets/img/avatars/7.png" alt="Avatar" class="rounded-circle" />
                                                        </li>
                                                        </ul>
                                                    </td>
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
                                    {/* <!--/ Basic Bootstrap Table --> */}
                            </div>
                            {/*/ Order Statistics */}

                            {/* Transactions */}
                            <div className="col-md-6 col-lg-4 order-2 mb-4">
                            <div className="card h-100">
                                <div className="card-header d-flex align-items-center justify-content-between">
                                <h5 className="card-title m-0 me-2">Transactions</h5>
                                <div className="dropdown">
                                    <button
                                    className="btn p-0"
                                    type="button"
                                    id="transactionID"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                    >
                                    <i className="bx bx-dots-vertical-rounded"></i>
                                    </button>
                                    <div className="dropdown-menu dropdown-menu-end" aria-labelledby="transactionID">
                                    <a className="dropdown-item" href="javascript:void(0);">Last 28 Days</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Last Month</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Last Year</a>
                                    </div>
                                </div>
                                </div>
                                <div className="card-body">
                                <ul className="p-0 m-0">
                                    <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="../assets/img/icons/unicons/paypal.png" alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                        <small className="text-muted d-block mb-1">Paypal</small>
                                        <h6 className="mb-0">Send money</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                        <h6 className="mb-0">+82.6</h6>
                                        <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="../assets/img/icons/unicons/wallet.png" alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                        <small className="text-muted d-block mb-1">Wallet</small>
                                        <h6 className="mb-0">Mac'D</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                        <h6 className="mb-0">+270.69</h6>
                                        <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="../assets/img/icons/unicons/chart.png" alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                        <small className="text-muted d-block mb-1">Transfer</small>
                                        <h6 className="mb-0">Refund</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                        <h6 className="mb-0">+637.91</h6>
                                        <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="../assets/img/icons/unicons/cc-success.png" alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                        <small className="text-muted d-block mb-1">Credit Card</small>
                                        <h6 className="mb-0">Ordered Food</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                        <h6 className="mb-0">-838.71</h6>
                                        <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                    </li>
                                    <li className="d-flex mb-4 pb-1">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="../assets/img/icons/unicons/wallet.png" alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                        <small className="text-muted d-block mb-1">Wallet</small>
                                        <h6 className="mb-0">Starbucks</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                        <h6 className="mb-0">+203.33</h6>
                                        <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                    </li>
                                    <li className="d-flex">
                                    <div className="avatar flex-shrink-0 me-3">
                                        <img src="../assets/img/icons/unicons/cc-warning.png" alt="User" className="rounded" />
                                    </div>
                                    <div className="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                                        <div className="me-2">
                                        <small className="text-muted d-block mb-1">Mastercard</small>
                                        <h6 className="mb-0">Ordered Food</h6>
                                        </div>
                                        <div className="user-progress d-flex align-items-center gap-1">
                                        <h6 className="mb-0">-92.45</h6>
                                        <span className="text-muted">USD</span>
                                        </div>
                                    </div>
                                    </li>
                                </ul>
                                </div>
                            </div>
                            </div>
                            {/*/ Transactions */}
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
