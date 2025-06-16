import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  getAllAssets,
  createNewAssetService,
  deleteAssetService,
  editAssetService,
} from "../../services/manageService";
import "../../styles/assetManage.scss";
import AddAssetModal from "../../component/AddAssetModal";
import EditAssetModal from "../../component/EditAssetModal";

class AssetManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allAssets: [],
      isLoading: true,
      error: null,
      isOpenCreateModal: false,
      isOpenEditModal: false,
      assetEdit: {},
    };
  }

  async componentDidMount() {
    await this.loadAssets();
  }

  loadAssets = async () => {
    this.setState({ isLoading: true, error: null });
    try {
      let response = await getAllAssets();
      if (response && response.errCode === 0) {
        this.setState({
          allAssets: response.assets || [],
          isLoading: false,
        });
      } else {
        throw new Error(response?.errMessage || "Dữ liệu không hợp lệ.");
      }
    } catch (e) {
      this.setState({
        error: "Có lỗi xảy ra khi tải danh sách.",
        isLoading: false,
      });
      toast.error("Có lỗi xảy ra khi tải danh sách!");
    }
  };

  handleAddNewAsset = () => {
    this.setState({
      isOpenCreateModal: true,
    });
  };

  toggleCreateModal = () => {
    this.setState({
      isOpenCreateModal: !this.state.isOpenCreateModal,
    });
  };

  createNewAsset = async (data) => {
    try {
      let response = await createNewAssetService(data);
      if (response && response.errCode !== 0) {
        toast.error(response.errMessage);
      } else {
        await this.loadAssets();
        this.setState({ isOpenCreateModal: false });
        toast.success("Thêm tài sản mới thành công!");
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  handleDeleteAsset = async (asset) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài sản này?")) {
      try {
        let res = await deleteAssetService(asset.asset_id);
        if (res && res.errCode === 0) {
          await this.loadAssets();
          toast.success("Xóa tài sản thành công!");
        } else {
          toast.error(res.errMessage);
        }
      } catch (e) {
        toast.error("Có lỗi xảy ra!");
      }
    }
  };

  handleEditAsset = (asset) => {
    this.setState({
      isOpenEditModal: true,
      assetEdit: asset,
    });
  };

  toggleEditModal = () => {
    this.setState({
      isOpenEditModal: !this.state.isOpenEditModal,
    });
  };

  doEditAsset = async (asset) => {
    try {
      let res = await editAssetService(asset);
      if (res && res.errCode === 0) {
        this.setState({ isOpenEditModal: false });
        await this.loadAssets();
        toast.success("Cập nhật tài sản thành công!");
      } else {
        toast.error(res.errMessage);
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra!");
    }
  };

  renderAssetTable = (title, assets, tableId) => {
    return (
      <div className="user-role-group">
        <h4 className="role-group-title">
          {title} - {assets.length}
        </h4>
        <div className="table-responsive">
          <table id={tableId} className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Tài sản</th>
                <th>Mô tả</th>
                <th className="text-center">Tổng SL</th>
                <th className="text-center">Tồn Kho</th>
                <th>Trạng thái</th>
                <th className="text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {assets && assets.length > 0 ? (
                assets.map((asset) => (
                  <tr key={asset.asset_id}>
                    <td data-label="ID">{asset.asset_id}</td>
                    <td data-label="Tên Tài sản">{asset.name}</td>
                    <td data-label="Mô tả">{asset.description}</td>
                    <td data-label="Tổng SL" className="text-center">
                      {asset.total_quantity}
                    </td>
                    <td data-label="SL Tồn Kho" className="text-center">
                      {asset.current_quantity !== null &&
                      asset.current_quantity !== undefined
                        ? asset.current_quantity
                        : "N/A"}
                    </td>
                    <td data-label="Trạng thái">{asset.status}</td>
                    <td data-label="Thao Tác">
                      <div className="btn-action-group">
                        <button
                          className="btn btn-edit"
                          title="Sửa tài sản"
                          onClick={() => this.handleEditAsset(asset)}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn btn-delete"
                          title="Xóa tài sản"
                          onClick={() => this.handleDeleteAsset(asset)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-20">
                    Không có tài sản nào trong nhóm này.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  render() {
    const {
      allAssets,
      isLoading,
      error,
      isOpenCreateModal,
      isOpenEditModal,
      assetEdit,
    } = this.state;

    const trackableAssets = allAssets.filter(
      (asset) => asset.is_trackable === 1 || asset.is_trackable === true
    );
    const nonTrackableAssets = allAssets.filter(
      (asset) => asset.is_trackable === 0 || asset.is_trackable === false
    );

    if (isLoading) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ TÀI SẢN & VẬT TƯ</h1>
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            Đang tải dữ liệu...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="system-main-content">
          <h1 className="title">QUẢN LÝ TÀI SẢN & VẬT TƯ</h1>
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i> {error}
          </div>
          <button className="btn btn-primary" onClick={this.loadAssets}>
            <i className="fas fa-sync-alt"></i>
            Thử lại
          </button>
        </div>
      );
    }

    return (
      <div className="system-main-content">
        <h1 className="title">QUẢN LÝ TÀI SẢN & VẬT TƯ</h1>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {isOpenCreateModal && (
          <AddAssetModal
            isOpen={isOpenCreateModal}
            toggleFromParent={this.toggleCreateModal}
            createNewAsset={this.createNewAsset}
          />
        )}
        {isOpenEditModal && (
          <EditAssetModal
            isOpen={isOpenEditModal}
            toggleFromParent={this.toggleEditModal}
            currentAsset={assetEdit}
            editAsset={this.doEditAsset}
          />
        )}
        <div className="admin-card">
          <div className="card-header">
            <h3>Danh sách tài sản</h3>
            <button
              className="btn btn-primary"
              onClick={this.handleAddNewAsset}
            >
              <i className="fas fa-plus"></i> Thêm tài sản mới
            </button>
          </div>
          <div className="card-body">
            {this.renderAssetTable(
              "Tài sản cần theo dõi số lượng (Tiêu hao)",
              trackableAssets,
              "trackable-assets-table"
            )}
            {this.renderAssetTable(
              "Tài sản khác (Cho thuê & Cố định)",
              nonTrackableAssets,
              "non-trackable-assets-table"
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AssetManage;
