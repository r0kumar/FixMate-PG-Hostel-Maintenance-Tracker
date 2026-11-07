import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import {
  PlusCircle,
  AlertCircle,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

const categories = [
  { value: 'electrical', label: 'Electrical (Fan, Light, Switch, Wiring)' },
  { value: 'plumbing', label: 'Plumbing (Tap, Leakage, Drainage, Pipe)' },
  { value: 'cleaning', label: 'Cleaning & Housekeeping' },
  { value: 'wifi', label: 'WiFi & Internet Connectivity' },
  { value: 'other', label: 'Other Miscellaneous' },
];

const priorities = [
  { value: 'low', label: 'Low (Can be fixed in 2-3 days)' },
  { value: 'medium', label: 'Medium (Normal standard priority)' },
  { value: 'high', label: 'High (Requires quick resolution)' },
  { value: 'urgent', label: 'Urgent (Immediate emergency repair)' },
];

const NewComplaint = () => {
  const { user, api, baseRoute } = useSession();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'plumbing',
    priority: 'medium',
    roomNumber: user?.room?.roomNumber || '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle image upload & base64 conversion
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormErrors({ ...formErrors, image: 'Please select a valid image file (PNG, JPG, WebP)' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormErrors({ ...formErrors, image: 'Image size should not exceed 5MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormErrors({ ...formErrors, image: '' });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Complaint title is required';
    if (!formData.description.trim()) errors.description = 'Please describe the problem';
    if (!formData.category) errors.category = 'Please choose a category';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setServerError('');
    setLoading(true);

    try {
      await api.post('/complaints', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        roomNumber: formData.roomNumber.trim(),
        image: imagePreview || '',
      });

      navigate(`${baseRoute}/resident/my-complaints`);
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Failed to submit complaint. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition shadow-sm"
          title="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Log Maintenance Request
          </h1>
          <p className="text-xs text-slate-500">
            Provide the issue details and our technicians will address it promptly
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        {serverError && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>{serverError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Issue Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Geyser in washroom not heating water"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 ${
                formErrors.title
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            {formErrors.title && (
              <p className="mt-1 text-xs text-rose-600">{formErrors.title}</p>
            )}
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority Level
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Room / Location Number
            </label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="e.g. 101 or Wing B - 204"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Detailed Description *
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide exact details about what is malfunctioning, where it is located in the room, and when the issue started..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 resize-none ${
                formErrors.description
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            {formErrors.description && (
              <p className="mt-1 text-xs text-rose-600">{formErrors.description}</p>
            )}
          </div>

          {/* Optional Single Image Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Attach Photo of the Issue (Optional)
            </label>

            {!imagePreview ? (
              <label className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/20 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">
                  Click to upload a photo
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, or WebP up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 w-full max-w-sm">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="p-2 text-xs text-slate-600 bg-white border-t border-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Image attached
                  </span>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="text-xs text-rose-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            {formErrors.image && (
              <p className="mt-1 text-xs text-rose-600">{formErrors.image}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Complaint...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Submit Complaint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewComplaint;
