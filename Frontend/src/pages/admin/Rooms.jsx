import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  DoorClosed,
  Plus,
  Trash2,
  Users,
  AlertCircle,
  Loader2,
  X,
  Building,
  CheckCircle2,
  Bed,
} from 'lucide-react';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  const [formData, setFormData] = useState({
    roomNumber: '',
    floor: 1,
    block: 'Wing A',
    capacity: 2,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/rooms');
      setRooms(data);
    } catch (err) {
      console.error('Failed to load rooms', err);
      setError('Could not fetch hostel room records.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.roomNumber.trim() || formData.floor === undefined) {
      setModalError('Please specify room number and floor.');
      return;
    }

    setModalLoading(true);
    setModalError('');

    try {
      await api.post('/rooms', {
        roomNumber: formData.roomNumber.trim().toUpperCase(),
        floor: Number(formData.floor),
        block: formData.block.trim(),
        capacity: Number(formData.capacity) || 2,
      });

      setShowModal(false);
      setFormData({ roomNumber: '', floor: 1, block: 'Wing A', capacity: 2 });
      fetchRooms();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to add room.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room "${roomNumber}"?`)) return;
    try {
      await api.delete(`/rooms/${id}`);
      fetchRooms();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  // Summary statistics
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + (r.occupants?.length || 0), 0);
  const vacantBeds = totalBeds - occupiedBeds;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Hostel Rooms & Inventory
          </h1>
          <p className="text-xs text-slate-500">
            Manage rooms, bed capacity, and real-time resident occupancy
          </p>
        </div>

        <button
          onClick={() => {
            setModalError('');
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Summary Allocation Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Units
          </span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{totalRooms} Rooms</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Total Beds
          </span>
          <div className="mt-2 text-2xl font-extrabold text-blue-600">{totalBeds} Beds</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Occupied
          </span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600">{occupiedBeds} Residents</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Available Vacancy
          </span>
          <div className="mt-2 text-2xl font-extrabold text-amber-600">{vacantBeds} Free Beds</div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={fetchRooms} className="font-semibold underline ml-2">
            Retry
          </button>
        </div>
      )}

      {/* Rooms Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500 flex flex-col items-center justify-center gap-2 bg-white rounded-3xl border border-slate-200/80">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading room allocations...</span>
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-3">
            <DoorClosed className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No rooms configured</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Define hostel rooms and bed capacities to map maintenance requests to physical units.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Add First Room
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rooms.map((room) => {
            const currentOccupants = room.occupants?.length || 0;
            const isFull = currentOccupants >= room.capacity;
            const isVacant = currentOccupants === 0;

            return (
              <div
                key={room._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Floor {room.floor} • {room.block}
                    </span>

                    <button
                      onClick={() => handleDelete(room._id, room.roomNumber)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                      title="Delete Room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Room {room.roomNumber}
                    </h3>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        isFull
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : isVacant
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {isFull ? 'Full' : isVacant ? 'Vacant' : 'Available'}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <p className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-slate-400" /> Bed Capacity:
                      </span>
                      <strong className="text-slate-700">{room.capacity} beds</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> Current Occupants:
                      </span>
                      <strong className="text-slate-700">{currentOccupants}</strong>
                    </p>
                  </div>
                </div>

                {/* Occupants list if any */}
                {room.occupants && room.occupants.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-600">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                      Residents:
                    </span>
                    <ul className="space-y-0.5">
                      {room.occupants.map((occ, i) => (
                        <li key={i} className="truncate">
                          • {occ.name || 'Resident'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add New Hostel Room</h3>
                <p className="text-xs text-slate-500">Define a room number and allocate bed capacity</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>{modalError}</div>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3.5" noValidate>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Room Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  placeholder="e.g. 101, 204B"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Floor *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Wing / Block
                  </label>
                  <input
                    type="text"
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    placeholder="e.g. Wing A"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Bed Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition"
                >
                  {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{modalLoading ? 'Creating...' : 'Create Room'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
