import React from "react";

export const filterServicesByType = (services, type) => {
  return services.filter((service) => service.type === type);
};

export const formatSelectedServices = (selectedServices, allServices, type) => {
  return Object.keys(selectedServices)
    .filter((serviceId) => {
      const service = allServices.find(
        (s) => s.service_id.toString() === serviceId
      );
      return !!service && service.type === type;
    })
    .map((serviceId) => {
      const service = allServices.find(
        (s) => s.service_id.toString() === serviceId
      );
      if (
        service &&
        service.name !== undefined &&
        selectedServices[serviceId] !== undefined
      ) {
        return `${service.name} (x${selectedServices[serviceId]})`;
      } else {
        console.warn(
          `[FORMAT_SERVICES] Dịch vụ không đầy đủ hoặc không tìm thấy: ID ${serviceId}, Type: ${type}`
        );
        return "";
      }
    })
    .filter(Boolean)
    .join(", ");
};

export const renderServiceSection = (
  bookingIndex,
  title,
  type,
  services,
  isLoadingServices,
  selectedServices,
  handleServiceCheckboxChange,
  handleServiceQuantityChange
) => {
  const filteredServices = services.filter((service) => {
    return service.type === type;
  });

  return (
    <div className="services-section">
      <h3>{title}</h3>
      <div className="services-grid">
        {isLoadingServices ? (
          <p>Đang tải dịch vụ...</p>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service) => {
            if (service.name === undefined) {
              console.error(
                `[R_SERV_SEC] LỖI: Thuộc tính 'name' của dịch vụ ID ${service.service_id} là UNDEFINED!`,
                service
              );
            }
            const isChecked = selectedServices.hasOwnProperty(
              service.service_id
            );

            return (
              <div className="service-item-quantity" key={service.service_id}>
                <label
                  htmlFor={`service-${bookingIndex}-${service.service_id}`}
                >
                  <input
                    type="checkbox"
                    id={`service-${bookingIndex}-${service.service_id}`}
                    name="services"
                    value={service.service_id}
                    onChange={handleServiceCheckboxChange}
                    checked={isChecked}
                  />
                  {service.name || "Tên dịch vụ không xác định"} (
                  {parseFloat(service.price).toLocaleString("vi-VN")} VNĐ){" "}
                </label>
                {isChecked && (
                  <div className="quantity-input">
                    <label
                      htmlFor={`quantity-${bookingIndex}-${service.service_id}`}
                    >
                      Số lượng:
                    </label>
                    <input
                      type="number"
                      id={`quantity-${bookingIndex}-${service.service_id}`}
                      name={service.service_id}
                      value={selectedServices[service.service_id] || 0}
                      onChange={handleServiceQuantityChange}
                      min="0"
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>Không có dịch vụ nào thuộc loại này.</p>
        )}
      </div>
    </div>
  );
};
