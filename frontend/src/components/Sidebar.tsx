import { Home, FlaskRound as Flask, Microscope, Users, File, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Microscope, label: 'Equipment', path: '/equipment' },
    { icon: Users, label: 'Lab Incharges', path: '/incharges' },
    { icon: MessageCircle, label: 'AI Assistant', path: '/assistant' },
    { icon: File, label: 'Generate Report', path: '/generate-report' },
  ];

  const sendMail = async () => {
  const recipients = ['oojamchaudhary.is23@rvce.edu.in', 'samkitsamsukha.is23@rvce.edu.in', 'sathvikhegde.is23@rvce.edu.in', 'mahalakshmibn.is23@rvce.edu.in', 'rajeshwarim@rvce.edu.in'];
  const labName = 'RVCE BioTechnology Lab';
  const alertMessage = 'Attention: An unforeseen situation has occurred in the lab. As you are in the vicinity, please take necessary precautions and stay alert. Your safety is our priority. More details will be communicated via ensuing emails. Stay Safe!';

  try {
    const res = await fetch('http://localhost:5000/api/lab/send-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipients, labName, alertMessage }),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Alert email sent!');
    } else {
      alert(`Error: ${data.message}`);
    }
  } catch (err) {
    alert('Failed to send alert email.');
    console.error(err);
  }
};


  return (
    <div className="min-h-screen w-64 bg-indigo-900 text-white p-6">
      <div className="fixed flex items-center gap-3">
        <Flask size={32} className="text-indigo-300" />
        <h1 className="text-2xl font-bold">BioLedger</h1>
      </div>
      <nav className='fixed top-24'>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <button onClick={()=>{
        sendMail()
      }} className='fixed bottom-12 w-52 px-6 py-3 rounded-xl text-red-700 bg-red-200 font-extrabold text-2xl border-2 border-red-700'>ALERT</button>
    </div>
  );
}