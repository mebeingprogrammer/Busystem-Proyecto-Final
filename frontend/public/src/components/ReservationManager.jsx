// ReservationManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL_RESERVATIONS = 'http://localhost:5000/reservations';
const API_URL_SCHEDULES = 'http://localhost:5000/schedules';

const ReservationManager = () => {
  const [reservations, setReservations] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    scheduleId: '',
    passengerName: '',
    passengerEmail: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReservations();
    fetchSchedules();
  }, []);

  const fetchReservations = async () => {
    const res = await axios.get(API_URL_RESERVATIONS);
    setReservations(res.data);
  };

  const fetchSchedules = async () => {
    const res = await axios.get(API_URL_SCHEDULES);
    setSchedules(res.data);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL_RESERVATIONS}/${editingId}`, formData);
      } else {
        await axios.post(API_URL_RESERVATIONS, formData);
      }
      setFormData({ scheduleId: '', passengerName: '', passengerEmail: '' });
      setEditingId(null);
      fetchReservations();
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      alert("Error al guardar la reserva. Revisa que los datos estén correctos.");
    }
  };

  const handleEdit = reservation => {
    setFormData({
      scheduleId: reservation.scheduleId._ID || reservation.scheduleId,
      passengerName: reservation.passengerName,
      passengerEmail: reservation.passengerEmail
    });
    setEditingId(reservation._ID);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que quieres eliminar esta reserva?')) {
      await axios.delete(`${API_URL_RESERVATIONS}/${id}`);
      fetchReservations();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Reservas</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            name="scheduleId"
            value={formData.scheduleId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona horario</option>
            {schedules.map(schedule => {
              const departureDate = new Date(schedule.departureTime);
              const arrivalDate = new Date(schedule.arrivalTime);
              return (
                <option key={schedule._ID} value={schedule._ID}>
                  {schedule.routeName} - {departureDate.toLocaleTimeString()} - {arrivalDate.toLocaleTimeString()}
                </option>
              );
            })}
          </select>
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del pasajero"
            name="passengerName"
            value={formData.passengerName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="email"
            className="form-control"
            placeholder="Correo electrónico"
            name="passengerEmail"
            value={formData.passengerEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Actualizar' : 'Registrar'}
          </button>
        </div>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Horario</th>
            <th>Pasajero</th>
            <th>Correo electrónico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation._ID}>
              <td>{reservation._ID}</td>
              <td>
                {(() => {
                  const schedule = schedules.find(s => s._ID === reservation.scheduleId);
                  if (!schedule) return 'Horario no disponible';
                  const dep = new Date(schedule.departureTime).toLocaleTimeString();
                  const arr = new Date(schedule.arrivalTime).toLocaleTimeString();
                  return `${schedule.routeName} - ${dep} - ${arr}`;
                })()}
              </td>
              <td>{reservation.passengerName}</td>
              <td>{reservation.passengerEmail}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(reservation)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(reservation._ID)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationManager;
