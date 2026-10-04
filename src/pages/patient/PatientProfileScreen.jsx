import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { patientService } from "../../services/patientService";

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  gender: "",
  blood_group: "",
  address: "",
  allergies: "",
  emergency_contact: "",
};

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const BLOOD_GROUP_OPTIONS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "O+",
  "O-",
  "AB+",
  "AB-",
];

function getProfileUser(profile) {
  return profile?.user || {};
}

function getFullName(profile) {
  const user = getProfileUser(profile);

  const firstName = user.first_name || profile?.first_name || "";
  const lastName = user.last_name || profile?.last_name || "";

  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || user.username || "Patient";
}

function getEmail(profile) {
  const user = getProfileUser(profile);
  return user.email || profile?.email || "";
}

function getPhone(profile) {
  return profile?.phone || "";
}

function getDateOfBirth(profile) {
  return profile?.date_of_birth || "";
}

function getGender(profile) {
  return profile?.gender || "";
}

function getBloodGroup(profile) {
  return profile?.blood_group || "";
}

function getAddress(profile) {
  return profile?.address || "";
}

function getAllergies(profile) {
  return profile?.allergies || "";
}

function getEmergencyContact(profile) {
  return profile?.emergency_contact || "";
}

function getUsername(profile) {
  const user = getProfileUser(profile);
  return user.username || "";
}

function getIsVerified(profile) {
  return Boolean(profile?.is_verified ?? profile?.verified);
}

function formatDate(dateString) {
  if (!dateString) return "Not provided";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(profile) {
  const user = getProfileUser(profile);

  const firstName = user.first_name || profile?.first_name || "";
  const lastName = user.last_name || profile?.last_name || "";

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  if (initials) return initials;

  const username = user.username || "";

  return username.slice(0, 2).toUpperCase() || "P";
}

function extractErrorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || "Something went wrong. Please try again.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.message) {
    return data.message;
  }

  const fieldErrors = Object.entries(data)
    .map(([field, value]) => {
      if (Array.isArray(value)) {
        return `${field}: ${value.join(", ")}`;
      }

      if (typeof value === "string") {
        return `${field}: ${value}`;
      }

      return null;
    })
    .filter(Boolean);

  if (fieldErrors.length > 0) {
    return fieldErrors.join(" | ");
  }

  return "Unable to update your profile. Please check your details and try again.";
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F3F7F5] text-[#2F7D68]">
        <Icon size={17} strokeWidth={2} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#8B9793]">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-[#25312E]">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-[#53615D]"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-[#DDE6E2] bg-white px-3.5 py-3 text-sm text-[#25312E] outline-none transition placeholder:text-[#A7B1AE] focus:border-[#2F7D68] focus:ring-2 focus:ring-[#2F7D68]/10"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold text-[#53615D]"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl border border-[#DDE6E2] bg-white px-3.5 py-3 pr-10 text-sm text-[#25312E] outline-none transition focus:border-[#2F7D68] focus:ring-2 focus:ring-[#2F7D68]/10"
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7D8985]"
        />
      </div>
    </div>
  );
}

export default function PatientProfileScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const fullName = useMemo(() => getFullName(profile), [profile]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await patientService.getMyProfile();

      const data = response?.data ?? response;

      setProfile(data || null);
    } catch (error) {
      console.error("Failed to load patient profile:", error);
      setLoadError(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const openEditModal = () => {
    if (!profile) return;

    setForm({
      first_name:
        getProfileUser(profile).first_name ||
        profile?.first_name ||
        "",
      last_name:
        getProfileUser(profile).last_name ||
        profile?.last_name ||
        "",
      email: getEmail(profile),
      phone: getPhone(profile),
      date_of_birth: getDateOfBirth(profile),
      gender: getGender(profile),
      blood_group: getBloodGroup(profile),
      address: getAddress(profile),
      allergies: getAllergies(profile),
      emergency_contact: getEmergencyContact(profile),
    });

    setSaveError("");
    setSaveSuccess("");
    setIsEditOpen(true);
  };

  const closeEditModal = () => {
    if (isSaving) return;

    setIsEditOpen(false);
    setSaveError("");
    setSaveSuccess("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (saveError) {
      setSaveError("");
    }

    if (saveSuccess) {
      setSaveSuccess("");
    }
  };

  const validateForm = () => {
    if (!form.first_name.trim()) {
      return "First name is required.";
    }

    if (!form.last_name.trim()) {
      return "Last name is required.";
    }

    if (!form.email.trim()) {
      return "Email is required.";
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      return "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      return "Phone number is required.";
    }

    if (!form.date_of_birth) {
      return "Date of birth is required.";
    }

    if (!form.gender) {
      return "Please select your gender.";
    }

    if (!form.blood_group) {
      return "Please select your blood group.";
    }

    return "";
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setSaveError(validationError);
      return;
    }

    try {
      setIsSaving(true);
      setSaveError("");
      setSaveSuccess("");

      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        date_of_birth: form.date_of_birth,
        gender: form.gender,
        blood_group: form.blood_group,
        address: form.address.trim(),
        allergies: form.allergies.trim(),
        emergency_contact: form.emergency_contact.trim(),
      };

      const response = await patientService.updateMyProfile(payload);

      const updatedProfile = response?.data ?? response;

      if (!updatedProfile) {
        throw new Error("The server returned an empty profile response.");
      }

      setProfile(updatedProfile);
      setSaveSuccess("Profile updated successfully.");

      setTimeout(() => {
        setIsEditOpen(false);
        setSaveSuccess("");
      }, 900);
    } catch (error) {
      console.error("Failed to update patient profile:", error);
      setSaveError(extractErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FBFA] px-4 py-8">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-8 w-40 rounded-lg bg-[#E7EFEC]" />

          <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex gap-5">
              <div className="h-20 w-20 rounded-full bg-[#E7EFEC]" />

              <div className="flex-1">
                <div className="h-5 w-44 rounded bg-[#E7EFEC]" />
                <div className="mt-3 h-4 w-64 rounded bg-[#E7EFEC]" />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="h-20 rounded-2xl bg-[#F0F5F3]" />
              <div className="h-20 rounded-2xl bg-[#F0F5F3]" />
              <div className="h-20 rounded-2xl bg-[#F0F5F3]" />
              <div className="h-20 rounded-2xl bg-[#F0F5F3]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F8FBFA] px-4 py-10">
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <AlertCircle size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-[#25312E]">
                  Unable to load profile
                </h2>

                <p className="mt-1 text-sm leading-6 text-[#71807B]">
                  {loadError}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadProfile}
              className="mt-5 rounded-xl bg-[#2F7D68] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#276B5A]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F8FBFA] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
          <User className="mx-auto text-[#2F7D68]" size={32} />

          <h2 className="mt-4 text-lg font-semibold text-[#25312E]">
            Profile not found
          </h2>

          <p className="mt-2 text-sm text-[#71807B]">
            We could not find your patient profile.
          </p>
        </div>
      </div>
    );
  }

  const username = getUsername(profile);
  const isVerified = getIsVerified(profile);

  return (
    <div className="min-h-screen bg-[#F8FBFA] px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B9793]">
              Account
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#25312E] sm:text-3xl">
              My Profile
            </h1>
          </div>

          <button
            type="button"
            onClick={openEditModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2F7D68] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#276B5A]"
          >
            <Edit3 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile hero */}
        <section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="h-24 bg-gradient-to-r from-[#DDF1EA] via-[#EAF6F1] to-[#F5FBF8]" />

          <div className="-mt-10 px-5 pb-6 sm:px-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-[#D9EEE7] text-xl font-bold text-[#2F7D68] shadow-sm">
                  {getInitials(profile)}
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-[#25312E]">
                      {fullName}
                    </h2>

                    {isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F6F0] px-2.5 py-1 text-[11px] font-semibold text-[#2F7D68]">
                        <ShieldCheck size={13} />
                        Verified
                      </span>
                    )}
                  </div>

                  {username && (
                    <p className="mt-1 text-sm text-[#7B8984]">
                      @{username}
                    </p>
                  )}
                </div>
              </div>

              {profile?.id !== undefined && profile?.id !== null && (
                <div className="rounded-xl bg-[#F5F8F7] px-3 py-2 text-xs text-[#71807B]">
                  Patient ID:{" "}
                  <span className="font-semibold text-[#53615D]">
                    {profile.id}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Personal information */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-[#25312E]">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-[#84908C]">
              Your information currently stored in MediSetu.
            </p>
          </div>

          <div className="mt-4 grid gap-x-8 md:grid-cols-2">
            <DetailRow
              icon={User}
              label="Full Name"
              value={fullName}
            />

            <DetailRow
              icon={Mail}
              label="Email"
              value={getEmail(profile)}
            />

            <DetailRow
              icon={Phone}
              label="Phone"
              value={getPhone(profile)}
            />

            <DetailRow
              icon={CalendarDays}
              label="Date of Birth"
              value={formatDate(getDateOfBirth(profile))}
            />

            <DetailRow
              icon={User}
              label="Gender"
              value={getGender(profile)}
            />

            <DetailRow
              icon={ShieldCheck}
              label="Blood Group"
              value={getBloodGroup(profile)}
            />

            <DetailRow
              icon={MapPin}
              label="Address"
              value={getAddress(profile)}
            />

            <DetailRow
              icon={AlertCircle}
              label="Allergies"
              value={getAllergies(profile)}
            />

            <DetailRow
              icon={Phone}
              label="Emergency Contact"
              value={getEmergencyContact(profile)}
            />
          </div>
        </section>

        {/* Account information */}
        <section className="mt-5 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <h2 className="text-lg font-bold text-[#25312E]">
            Account Information
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-[#F6F9F8] p-4">
              <p className="text-xs font-medium text-[#8B9793]">
                Username
              </p>

              <p className="mt-1 text-sm font-semibold text-[#25312E]">
                {username || "Not provided"}
              </p>

              <p className="mt-1 text-xs text-[#8B9793]">
                Username is your fixed system identifier.
              </p>
            </div>

            <div className="rounded-2xl bg-[#F6F9F8] p-4">
              <p className="text-xs font-medium text-[#8B9793]">
                Account Role
              </p>

              <p className="mt-1 text-sm font-semibold text-[#25312E]">
                {getProfileUser(profile).role || "PATIENT"}
              </p>
            </div>
          </div>
        </section>

        {/* Logout */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-red-100 bg-white px-6 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Edit modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#17221F]/45 p-0 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="max-h-[94vh] w-full overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-w-3xl sm:rounded-3xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#EDF1EF] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#25312E]">
                  Edit Profile
                </h2>

                <p className="mt-0.5 text-xs text-[#8B9793]">
                  Update your personal information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={isSaving}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#71807B] transition hover:bg-[#F2F6F4] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close edit profile"
              >
                <X size={19} />
              </button>
            </div>

            {/* Modal body */}
            <form
              onSubmit={handleSave}
              className="max-h-[calc(94vh-76px)] overflow-y-auto px-5 py-5 sm:px-6"
            >
              {saveError && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <p className="text-sm leading-5 text-red-700">
                    {saveError}
                  </p>
                </div>
              )}

              {saveSuccess && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#CDEBDD] bg-[#F0FAF5] p-4">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-[#2F7D68]"
                  />

                  <p className="text-sm font-medium text-[#286B59]">
                    {saveSuccess}
                  </p>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="First Name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />

                <Field
                  label="Last Name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />

                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91..."
                  required
                />

                <Field
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  required
                />

                <SelectField
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={GENDER_OPTIONS}
                  placeholder="Select gender"
                />

                <SelectField
                  label="Blood Group"
                  name="blood_group"
                  value={form.blood_group}
                  onChange={handleChange}
                  options={BLOOD_GROUP_OPTIONS}
                  placeholder="Select blood group"
                />

                <Field
                  label="Emergency Contact"
                  name="emergency_contact"
                  type="tel"
                  value={form.emergency_contact}
                  onChange={handleChange}
                  placeholder="+91..."
                />

                <div className="sm:col-span-2">
                  <Field
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter residential address"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Field
                    label="Allergies"
                    name="allergies"
                    value={form.allergies}
                    onChange={handleChange}
                    placeholder="e.g. Penicillin, Dust"
                  />
                </div>
              </div>

              {/* Username intentionally not editable */}
              <div className="mt-5 rounded-2xl bg-[#F5F8F7] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-[#2F7D68]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#25312E]">
                      Username
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#7B8984]">
                      @{username || "Not provided"} — username is a fixed
                      system identifier and cannot be changed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isSaving}
                  className="rounded-xl border border-[#DDE6E2] bg-white px-5 py-3 text-sm font-semibold text-[#53615D] transition hover:bg-[#F6F9F8] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F7D68] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#276B5A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}