const RideCard = ({ ride }) => {
  return (
    <div className="p-4 border rounded mb-3 shadow-sm bg-white">
      <p><strong>From:</strong> {ride.pickupLocation}</p>
      <p><strong>To:</strong> {ride.destination}</p>
      <p><strong>Fare:</strong> KES {ride.fare}</p>
      <p><strong>Status:</strong> {ride.status}</p>

      {ride.driver && ride.driverProfile && (
        <div className="mt-2 p-2 border-t">
          <h4 className="font-semibold">Driver Info</h4>
          <p>{ride.driver.name} ({ride.driver.email})</p>
          <p>Vehicle: {ride.driverProfile.vehicleModel} - {ride.driverProfile.vehiclePlate}</p>
          <p>Color: {ride.driverProfile.vehicleColor}</p>
          <p>License: {ride.driverProfile.licenseNumber}</p>
        </div>
      )}
    </div>
  );
};
