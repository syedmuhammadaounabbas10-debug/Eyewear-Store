import React, { useState } from 'react';
import { ManualPrescription } from '../types/eyewear';
import { X, Upload, FileText, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface PrescriptionHubProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePrescription?: (prescriptionData: any) => void;
}

export const PrescriptionHub: React.FC<PrescriptionHubProps> = ({
  isOpen,
  onClose,
  onSavePrescription,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');
  const [fileAttached, setFileAttached] = useState<File | null>(null);
  const [manual, setManual] = useState<ManualPrescription>({
    odSphere: '-1.25',
    odCyl: '-0.50',
    odAxis: '180',
    osSphere: '-1.50',
    osCyl: '-0.25',
    osAxis: '175',
    pd: '63',
  });
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileAttached(e.target.files[0]);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onSavePrescription) {
      onSavePrescription({
        method: activeTab,
        fileName: fileAttached ? fileAttached.name : 'Doctor_Prescription.pdf',
        manualData: manual,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSaved ? (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c9a24b]/20 text-[#0f172a] rounded-full text-xs font-bold uppercase mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c9a24b]" />
                <span>Doctor Verified Prescription Hub</span>
              </div>
              <h2 className="text-2xl font-extrabold text-[#0f172a] font-['Plus_Jakarta_Sans']">
                Add Your Prescription Detail
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload a scan or photo from your optometrist, or manually enter your OD/OS sphere, cylinder, axis, and pupil distance (PD).
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'upload' ? 'bg-[#0f172a] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                Upload Photo / PDF Scan
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'manual' ? 'bg-[#0f172a] text-white shadow' : 'text-slate-600 hover:text-black'
                }`}
              >
                Enter Sph / Cyl Numbers
              </button>
            </div>

            {/* Upload Tab */}
            {activeTab === 'upload' ? (
              <div className="space-y-4">
                <label className="border-2 border-dashed border-[#c9a24b]/60 hover:border-[#c9a24b] bg-slate-50 rounded-2xl p-8 text-center cursor-pointer block transition-colors">
                  <Upload className="w-10 h-10 text-[#c9a24b] mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#0f172a]">
                    {fileAttached ? fileAttached.name : 'Click to Upload Prescription File'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, PDF scans (Max 10MB)</p>
                  <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
                </label>

                {fileAttached && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>File "{fileAttached.name}" successfully attached and ready for optometrist audit.</span>
                  </div>
                )}
              </div>
            ) : (
              /* Manual Input Form */
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2 text-xs text-center font-bold text-slate-700 pb-1 border-b border-slate-200">
                  <span className="text-left col-span-1">Eye</span>
                  <span>Sphere (SPH)</span>
                  <span>Cylinder (CYL)</span>
                  <span>Axis</span>
                  <span>ADD (Bifocal)</span>
                </div>

                {/* Right Eye OD */}
                <div className="grid grid-cols-5 gap-2 items-center text-xs">
                  <span className="font-bold text-[#0f172a] text-left">OD (Right Eye)</span>
                  <input
                    type="text"
                    value={manual.odSphere}
                    onChange={(e) => setManual({ ...manual, odSphere: e.target.value })}
                    className="p-2 border border-slate-300 rounded text-center focus:outline-none"
                  />
                  <input
                    type="text"
                    value={manual.odCyl}
                    onChange={(e) => setManual({ ...manual, odCyl: e.target.value })}
                    className="p-2 border border-slate-300 rounded text-center focus:outline-none"
                  />
                  <input
                    type="text"
                    value={manual.odAxis}
                    onChange={(e) => setManual({ ...manual, odAxis: e.target.value })}
                    className="p-2 border border-slate-300 rounded text-center focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="+0.00"
                    value={manual.odAdd || ''}
                    onChange={(e) => setManual({ ...manual, odAdd: e.target.value })}
                    className="p-2 border border-slate-300 rounded text-center focus:outline-none"
                  />
                </div>

                {/* Left Eye OS */}
                <div className="grid grid-cols-5 gap-2 items-center text-xs">
                  <span className="font-bold text-[#0f172a] text-left">OS (Left Eye)</span>
                  <input
                    type="text"
                    value={manual.osSphere}
                    onChange={(e) => setManual({ ...manual, osSphere: e.target.value })}
                    className="p-2 border border-slate-300 rounded text-center focus:outline-none"
                  />
                  <input
                    type="text"
                    value={manual.osCyl}
                    onChange={(e) => setManual({ ...manual, osCyl: e.target.value })}
                    className="p-2 border border-slate-300 rounded text-center focus:outline-none"
                  />
                  <input
                    type="text"
                    value={manual.osAxis}
                    onChange={(e) => setManual({ ...manual, osAxis: e.target.value })}
                    className="p-2 border border-slate-300 rounded text-center focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="+0.00"
                    value={manual.osAdd || ''}
                    onChange={(e) => setManual({ ...manual, osAdd: e.target.value })}
                    className="p-2 border border-slate-300 rounded text-center focus:outline-none"
                  />
                </div>

                {/* PD Distance */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <label className="font-bold text-slate-700">Pupillary Distance (PD in mm):</label>
                  <input
                    type="text"
                    value={manual.pd}
                    onChange={(e) => setManual({ ...manual, pd: e.target.value })}
                    className="w-24 p-2 border border-slate-300 rounded text-center font-bold"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold rounded-xl shadow-lg transition-all"
            >
              Save Prescription To Session
            </button>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#0f172a]">Prescription Saved!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your prescription details will be attached to your frame order during checkout.
            </p>
            <button onClick={onClose} className="px-6 py-2.5 bg-[#0f172a] text-white text-xs font-bold rounded-xl">
              Return to Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
