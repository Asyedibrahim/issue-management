import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LgSideBar from '../components/LgSideBar'
import SmSideBar from '../components/SmSideBar';
import IssueList from './IssueList';
import Stats from './Stats';
import UserList from './UserList';
import CategoryList from './CategoryList';

export default function Dashboard() {

  const location = useLocation();
  const navigate = useNavigate();
  const [tab, setTab] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) return;
  
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
  
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      navigate('/dashboard?tab=stats');
    }
  }, [location.search, navigate]);

  return (
    <div className='flex flex-col lg:flex-row min-h-screen'>

      {/* SideBar large device */}
      <div className='lg:w-72 hidden lg:inline fixed h-full'>
        <LgSideBar />
      </div>

      {/* SideBar small device */}
      <div className="lg:hidden">
        <SmSideBar />
      </div>

      {tab === 'issues' && <IssueList />}
      {tab === 'stats' && <Stats />}
      {tab === 'users' && currentUser?.role === 'Admin' && <UserList />}
      {tab === 'categories' && currentUser?.role === 'Admin' && <CategoryList />}

    </div>
  )
}