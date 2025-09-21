const trips = []; // temporary in-memory storage

export const createTrip = (req, res) => {
  const { driverId, passengerId, pickup, dropoff } = req.body;
  const trip = { id: trips.length + 1, driverId, passengerId, pickup, dropoff };
  trips.push(trip);
  res.json({ message: "Trip created", trip });
};

export const getTrips = (req, res) => {
  res.json(trips);
};
