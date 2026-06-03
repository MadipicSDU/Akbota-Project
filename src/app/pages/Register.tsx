import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';
import logo from 'figma:asset/dbb038ad5d852716143789b73f4befd818daf8b1.png';
import {
  User,
  Building2,
  ShieldCheck,
  Upload,
  ChevronRight,
  ChevronLeft,
  Check,
  GraduationCap,
  Briefcase,
  Globe,
  FileText,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Info,
  CreditCard,
  MapPin,
} from 'lucide-react';

type Role = 'freelancer' | 'customer' | 'admin';

interface FreelancerData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationalId: string;
  universityName: string;
  studentId: string;
  portfolioLink: string;
  cvFileName: string;
  diplomaFileName: string;
  photoFileName: string;
}

interface OrganizationData {
  companyName: string;
  businessRegNumber: string;
  taxId: string;
  companyEmail: string;
  companyPhone: string;
  registeredAddress: string;
  incorporationFileName: string;
  repFullName: string;
  repIdFileName: string;
  companyWebsite: string;
}

interface AdminData {
  fullName: string;
  workEmail: string;
  employeeId: string;
  rolePosition: string;
  accessLevel: 'Admin' | 'Moderator' | 'Super Admin';
  approvalConfirmation: boolean;
}

interface Credentials {
  password: string;
  confirmPassword: string;
}

interface PaymentData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
}

const STEPS = ['Select Role', 'Verify Identity', 'Set Password', 'Payment Setup'];

const ACCESS_LEVELS = ['Admin', 'Moderator', 'Super Admin'] as const;

function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-3 pb-1 border-b border-indigo-100">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  id,
  required,
  optional,
  hint,
  children,
}: {
  label: string;
  id?: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {optional && <span className="text-gray-400 text-xs ml-1">(optional)</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
          <Info size={11} />
          {hint}
        </p>
      )}
    </div>
  );
}

function TextInput({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
}: {
  id?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
    />
  );
}

function FileInput({
  label,
  fileName,
  onChange,
  accept,
  optional,
}: {
  label: string;
  fileName: string;
  onChange: (name: string) => void;
  accept?: string;
  optional?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onChange(f.name);
  };

  return (
    <div>
      <Field label={label} optional={optional}>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => ref.current?.click()}
          className={`w-full flex items-center gap-3 px-3 py-3 border-2 border-dashed rounded-lg cursor-pointer transition text-sm ${
            dragging
              ? 'border-indigo-500 bg-indigo-50'
              : fileName
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
          }`}
        >
          <Upload size={16} className={fileName ? 'text-green-500 shrink-0' : 'text-indigo-500 shrink-0'} />
          <div className="flex-1 min-w-0">
            {fileName ? (
              <span className="text-gray-900 truncate block">{fileName}</span>
            ) : (
              <span className="text-gray-400">
                {dragging ? 'Drop file here' : 'Click or drag file to upload'}
              </span>
            )}
          </div>
          {fileName ? (
            <Check size={14} className="text-green-500 shrink-0" />
          ) : (
            <span className="text-xs text-gray-400 shrink-0">Browse</span>
          )}
        </div>
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onChange(f.name);
          }}
        />
      </Field>
    </div>
  );
}

function FreelancerForm({
  data,
  onChange,
}: {
  data: FreelancerData;
  onChange: (d: Partial<FreelancerData>) => void;
}) {
  const set = (key: keyof FreelancerData) => (v: string) => onChange({ [key]: v });
  return (
    <div>
      <FieldGroup title="Personal Information">
        <Field label="Full Name" id="fullName" required>
          <TextInput id="fullName" placeholder="e.g. Aibek Dzhaksybekov" value={data.fullName} onChange={set('fullName')} required />
        </Field>
        <Field label="Email Address" id="fl-email" hint="Preferably your university email (e.g. you@university.edu)">
          <TextInput id="fl-email" type="email" placeholder="you@university.edu" value={data.email} onChange={set('email')} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone Number" id="phone">
            <TextInput id="phone" type="tel" placeholder="+7 700 000 0000" value={data.phone} onChange={set('phone')} />
          </Field>
          <Field label="Date of Birth" id="dob">
            <TextInput id="dob" type="date" value={data.dateOfBirth} onChange={set('dateOfBirth')} />
          </Field>
        </div>
        <Field label="National ID / Passport Number" id="nationalId" required hint="Your government-issued identification number">
          <TextInput id="nationalId" placeholder="e.g. 123456789" value={data.nationalId} onChange={set('nationalId')} required />
        </Field>
      </FieldGroup>

      <FieldGroup title="Academic Information">
        <Field label="University Name" id="university" required>
          <TextInput id="university" placeholder="e.g. Nazarbayev University" value={data.universityName} onChange={set('universityName')} required />
        </Field>
        <Field label="Student ID" id="studentId" required>
          <TextInput id="studentId" placeholder="e.g. 20220001" value={data.studentId} onChange={set('studentId')} required />
        </Field>
        <FileInput label="CV / Resume" fileName={data.cvFileName} onChange={(v) => onChange({ cvFileName: v })} accept=".pdf,.doc,.docx" />
        <FileInput label="Diploma or Academic Transcript" fileName={data.diplomaFileName} onChange={(v) => onChange({ diplomaFileName: v })} accept=".pdf,.jpg,.png" optional />
      </FieldGroup>

      <FieldGroup title="Portfolio & Photo">
        <Field label="Portfolio Link" id="portfolio" optional hint="GitHub, Behance, Dribbble, or any public portfolio URL">
          <div className="relative">
            <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="portfolio"
              type="url"
              placeholder="https://github.com/yourname"
              value={data.portfolioLink}
              onChange={(e) => onChange({ portfolioLink: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
        </Field>
        <FileInput label="Profile Photo" fileName={data.photoFileName} onChange={(v) => onChange({ photoFileName: v })} accept=".jpg,.jpeg,.png" />
      </FieldGroup>
    </div>
  );
}

function OrganizationForm({
  data,
  onChange,
}: {
  data: OrganizationData;
  onChange: (d: Partial<OrganizationData>) => void;
}) {
  const set = (key: keyof OrganizationData) => (v: string) => onChange({ [key]: v });
  return (
    <div>
      <FieldGroup title="Company Details">
        <Field label="Company Name (Legal Entity)" id="companyName" required>
          <TextInput id="companyName" placeholder="e.g. TechCorp LLP" value={data.companyName} onChange={set('companyName')} required />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Business Registration Number (BIN)" id="bin" required hint="12-digit BIN or equivalent">
            <TextInput id="bin" placeholder="e.g. 221140001234" value={data.businessRegNumber} onChange={set('businessRegNumber')} required />
          </Field>
          <Field label="Tax Identification Number" id="tin" optional>
            <TextInput id="tin" placeholder="e.g. 870516350123" value={data.taxId} onChange={set('taxId')} />
          </Field>
        </div>
        <Field label="Official Company Email" id="companyEmail" required>
          <TextInput id="companyEmail" type="email" placeholder="info@company.kz" value={data.companyEmail} onChange={set('companyEmail')} required />
        </Field>
        <Field label="Company Phone Number" id="companyPhone">
          <TextInput id="companyPhone" type="tel" placeholder="+7 727 000 0000" value={data.companyPhone} onChange={set('companyPhone')} />
        </Field>
        <Field label="Registered Address" id="address" required>
          <TextInput id="address" placeholder="Street, City, Country" value={data.registeredAddress} onChange={set('registeredAddress')} required />
        </Field>
        <Field label="Company Website or LinkedIn" id="website" optional>
          <div className="relative">
            <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="website"
              type="url"
              placeholder="https://company.kz"
              value={data.companyWebsite}
              onChange={(e) => onChange({ companyWebsite: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
        </Field>
      </FieldGroup>

      <FieldGroup title="Legal Documents">
        <FileInput
          label="Certificate of Incorporation / Registration Document"
          fileName={data.incorporationFileName}
          onChange={(v) => onChange({ incorporationFileName: v })}
          accept=".pdf,.jpg,.png"
        />
      </FieldGroup>

      <FieldGroup title="Authorized Representative">
        <Field label="Representative Full Name" id="repName" required>
          <TextInput id="repName" placeholder="e.g. Nursultan Bekov" value={data.repFullName} onChange={set('repFullName')} required />
        </Field>
        <FileInput
          label="Representative ID Document"
          fileName={data.repIdFileName}
          onChange={(v) => onChange({ repIdFileName: v })}
          accept=".pdf,.jpg,.png"
        />
      </FieldGroup>
    </div>
  );
}

function AdminForm({
  data,
  onChange,
}: {
  data: AdminData;
  onChange: (d: Partial<AdminData>) => void;
}) {
  const set = (key: keyof AdminData) => (v: string) => onChange({ [key]: v });
  return (
    <div>
      <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-2 text-sm text-amber-800">
        <ShieldCheck size={16} className="shrink-0 mt-0.5" />
        <span>Admin accounts require internal approval before activation. All fields will be verified by the platform team.</span>
      </div>

      <FieldGroup title="Staff Information">
        <Field label="Full Name" id="adminName" required>
          <TextInput id="adminName" placeholder="e.g. Dinara Seitkali" value={data.fullName} onChange={set('fullName')} required />
        </Field>
        <Field label="Work Email" id="workEmail" required hint="Must use an official company domain">
          <TextInput id="workEmail" type="email" placeholder="d.seitkali@nomad-network.kz" value={data.workEmail} onChange={set('workEmail')} required />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Employee ID / Staff Code" id="empId" required>
            <TextInput id="empId" placeholder="e.g. STAFF-0042" value={data.employeeId} onChange={set('employeeId')} required />
          </Field>
          <Field label="Role / Position" id="position" required>
            <TextInput id="position" placeholder="e.g. Trust & Safety Manager" value={data.rolePosition} onChange={set('rolePosition')} required />
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup title="Access & Approval">
        <Field label="Access Level" id="accessLevel" required>
          <select
            id="accessLevel"
            value={data.accessLevel}
            onChange={(e) => onChange({ accessLevel: e.target.value as AdminData['accessLevel'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          >
            {ACCESS_LEVELS.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </Field>
        <Field label="Internal Approval Confirmation" id="approval">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              id="approval"
              type="checkbox"
              checked={data.approvalConfirmation}
              onChange={(e) => onChange({ approvalConfirmation: e.target.checked })}
              className="mt-0.5 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">
              I confirm that I have received internal authorization from platform management to create an admin account.
            </span>
          </label>
        </Field>
      </FieldGroup>
    </div>
  );
}

function PasswordForm({
  data,
  onChange,
}: {
  data: Credentials;
  onChange: (d: Partial<Credentials>) => void;
}) {
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  const strength = (() => {
    const pw = data.password;
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500'][strength];

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="pw" className="block text-sm font-medium text-gray-700 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="pw"
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={data.password}
            onChange={(e) => onChange({ password: e.target.value })}
            required
            className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {data.password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200'}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500">Strength: <span className="font-medium">{strengthLabel}</span></p>
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
          <Info size={11} /> Min. 8 characters, include uppercase, number, and symbol for a stronger password
        </p>
      </div>

      <div>
        <label htmlFor="cpw" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="cpw"
            type={showCpw ? 'text' : 'password'}
            placeholder="••••••••"
            value={data.confirmPassword}
            onChange={(e) => onChange({ confirmPassword: e.target.value })}
            required
            className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
          />
          <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showCpw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {data.confirmPassword && data.password !== data.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
        )}
        {data.confirmPassword && data.password === data.confirmPassword && (
          <p className="mt-1 text-xs text-green-600 flex items-center gap-1"><Check size={12} /> Passwords match</p>
        )}
      </div>
    </div>
  );
}

function PaymentForm({
  data,
  onChange,
}: {
  data: PaymentData;
  onChange: (d: Partial<PaymentData>) => void;
}) {
  const set = (key: keyof PaymentData) => (v: string) => onChange({ [key]: v });

  return (
    <div>
      <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2 text-sm text-blue-800">
        <CreditCard size={16} className="shrink-0 mt-0.5" />
        <span>Payment information is required for future transactions and escrow functionality. Your card will not be charged during registration.</span>
      </div>

      <FieldGroup title="Card Details">
        <Field label="Cardholder Name" id="cardholderName" required>
          <TextInput
            id="cardholderName"
            placeholder="e.g. John Doe"
            value={data.cardholderName}
            onChange={set('cardholderName')}
            required
          />
        </Field>
        <Field label="Card Number" id="cardNumber" required>
          <div className="relative">
            <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={data.cardNumber}
              onChange={(e) => set('cardNumber')(e.target.value)}
              required
              maxLength={19}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Expiry Date" id="expiryDate" required>
            <input
              id="expiryDate"
              type="text"
              placeholder="MM/YY"
              value={data.expiryDate}
              onChange={(e) => set('expiryDate')(e.target.value)}
              required
              maxLength={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </Field>
          <Field label="CVV" id="cvv" required>
            <input
              id="cvv"
              type="text"
              placeholder="123"
              value={data.cvv}
              onChange={(e) => set('cvv')(e.target.value)}
              required
              maxLength={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </Field>
        </div>
      </FieldGroup>

      <FieldGroup title="Billing Address">
        <Field label="Billing Address" id="billingAddress" optional hint="Street, City, Country">
          <div className="relative">
            <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="billingAddress"
              type="text"
              placeholder="e.g. 123 Main St, Almaty, Kazakhstan"
              value={data.billingAddress}
              onChange={(e) => set('billingAddress')(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>
        </Field>
      </FieldGroup>
    </div>
  );
}

const ROLE_CARDS: { role: Role; icon: React.ReactNode; label: string; subtitle: string; color: string; borderColor: string; bgColor: string }[] = [
  {
    role: 'freelancer',
    icon: <GraduationCap size={28} />,
    label: 'Freelancer / Student',
    subtitle: 'Find projects, build skills, gain experience',
    color: 'text-indigo-600',
    borderColor: 'border-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  {
    role: 'customer',
    icon: <Building2 size={28} />,
    label: 'Organization / Client',
    subtitle: 'Post projects, hire talented students',
    color: 'text-emerald-600',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-50',
  },
  {
    role: 'admin',
    icon: <ShieldCheck size={28} />,
    label: 'Platform Staff',
    subtitle: 'Manage platform, moderate content',
    color: 'text-purple-600',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50',
  },
];

export default function Register() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [freelancerData, setFreelancerData] = useState<FreelancerData>({
    fullName: '', email: '', phone: '', dateOfBirth: '', nationalId: '',
    universityName: '', studentId: '', portfolioLink: '',
    cvFileName: '', diplomaFileName: '', photoFileName: '',
  });

  const [orgData, setOrgData] = useState<OrganizationData>({
    companyName: '', businessRegNumber: '', taxId: '', companyEmail: '',
    companyPhone: '', registeredAddress: '', incorporationFileName: '',
    repFullName: '', repIdFileName: '', companyWebsite: '',
  });

  const [adminData, setAdminData] = useState<AdminData>({
    fullName: '', workEmail: '', employeeId: '', rolePosition: '',
    accessLevel: 'Moderator', approvalConfirmation: false,
  });

  const [credentials, setCredentials] = useState<Credentials>({ password: '', confirmPassword: '' });

  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const getName = () => {
    if (role === 'freelancer') return freelancerData.fullName;
    if (role === 'customer') return orgData.companyName;
    if (role === 'admin') return adminData.fullName;
    return '';
  };

  const getEmail = () => {
    if (role === 'freelancer') return freelancerData.email;
    if (role === 'customer') return orgData.companyEmail;
    if (role === 'admin') return adminData.workEmail;
    return '';
  };

  const validateStep = () => {
    if (step === 0) return role !== null;
    if (step === 1) {
      if (role === 'freelancer') return !!freelancerData.fullName && !!freelancerData.nationalId && !!freelancerData.universityName && !!freelancerData.studentId;
      if (role === 'customer') return !!orgData.companyName && !!orgData.businessRegNumber && !!orgData.companyEmail && !!orgData.registeredAddress && !!orgData.repFullName;
      if (role === 'admin') return !!adminData.fullName && !!adminData.workEmail && !!adminData.employeeId && !!adminData.rolePosition && adminData.approvalConfirmation;
    }
    if (step === 2) {
      return credentials.password.length >= 6 && credentials.password === credentials.confirmPassword;
    }
    if (step === 3) {
      return !!paymentData.cardholderName && !!paymentData.cardNumber && !!paymentData.expiryDate && !!paymentData.cvv;
    }
    return true;
  };

  const handleNext = () => {
    setError('');
    if (!validateStep()) {
      if (step === 0) setError('Please select a role to continue.');
      else if (step === 1) setError('Please fill in all required fields.');
      else if (step === 2) setError('Password must be at least 6 characters and match the confirmation.');
      else if (step === 3) setError('Please fill in all required payment fields.');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateStep()) {
      setError('Please fill in all required payment fields.');
      return;
    }
    setLoading(true);
    try {
      const authRole: UserRole = role === 'admin' ? 'admin' : role === 'customer' ? 'customer' : 'freelancer';
      const success = await register(getEmail() || `user_${Date.now()}@nomad.kz`, credentials.password, getName(), authRole);
      if (success) {
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCard = ROLE_CARDS.find((c) => c.role === role);

  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <div className="flex flex-col items-center mb-5">
          <img src={logo} alt="Nomad Freelancer Network" className="w-16 h-16 object-contain mb-3" />
          <h1 className="text-xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-indigo-600 font-semibold text-sm">Nomad Freelancer Network</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    i < step
                      ? 'bg-indigo-600 text-white'
                      : i === step
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs mt-1 font-medium whitespace-nowrap ${i === step ? 'text-indigo-600' : i < step ? 'text-gray-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit}>
        <div className="px-8 py-6 max-h-[55vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Step 0: Role Selection */}
          {step === 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Select your account type to get started with identity verification.
              </p>
              <div className="space-y-3">
                {ROLE_CARDS.map((card) => (
                  <button
                    key={card.role}
                    type="button"
                    onClick={() => setRole(card.role)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      role === card.role
                        ? `${card.borderColor} ${card.bgColor}`
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`shrink-0 ${role === card.role ? card.color : 'text-gray-400'}`}>
                      {card.icon}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${role === card.role ? card.color : 'text-gray-700'}`}>
                        {card.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{card.subtitle}</p>
                    </div>
                    <div className="ml-auto">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        role === card.role ? `${card.borderColor} ${card.bgColor}` : 'border-gray-300'
                      }`}>
                        {role === card.role && <div className={`w-2.5 h-2.5 rounded-full ${card.color.replace('text-', 'bg-')}`} />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Identity Verification */}
          {step === 1 && (
            <div>
              {selectedCard && (
                <div className={`flex items-center gap-2 mb-5 px-3 py-2 rounded-lg ${selectedCard.bgColor}`}>
                  <span className={selectedCard.color}>{selectedCard.icon ? <span style={{ display: 'inline-flex', transform: 'scale(0.75)' }}>{selectedCard.icon}</span> : null}</span>
                  <span className={`text-sm font-semibold ${selectedCard.color}`}>{selectedCard.label} Verification</span>
                </div>
              )}
              {role === 'freelancer' && (
                <FreelancerForm data={freelancerData} onChange={(d) => setFreelancerData((p) => ({ ...p, ...d }))} />
              )}
              {role === 'customer' && (
                <OrganizationForm data={orgData} onChange={(d) => setOrgData((p) => ({ ...p, ...d }))} />
              )}
              {role === 'admin' && (
                <AdminForm data={adminData} onChange={(d) => setAdminData((p) => ({ ...p, ...d }))} />
              )}
            </div>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <div>
              <p className="text-sm text-gray-600 mb-5 text-center">
                Set a secure password to protect your account.
              </p>
              <PasswordForm data={credentials} onChange={(d) => setCredentials((p) => ({ ...p, ...d }))} />
            </div>
          )}

          {/* Step 3: Payment Setup */}
          {step === 3 && (
            <div>
              <p className="text-sm text-gray-600 mb-5 text-center">
                Add your payment information for future transactions and escrow services.
              </p>
              <PaymentForm data={paymentData} onChange={(d) => setPaymentData((p) => ({ ...p, ...d }))} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 pt-4 border-t border-gray-100">
          <div className="flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => { setStep(step - 1); setError(''); }}
                className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <ChevronLeft size={16} /> Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account…' : <><Check size={16} /> Create Account</>}
              </button>
            )}
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
