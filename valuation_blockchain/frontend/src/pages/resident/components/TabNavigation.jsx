const TabNavigation = ({ activeTab, setActiveTab, timelineEvents }) => (
  <div className="flex gap-1.5 mb-8 bg-green-100 p-1.5 rounded-2xl border border-green-200 shadow-inner">
    <button
      onClick={() => setActiveTab('details')}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
        activeTab === 'details'
          ? 'bg-white text-green-900 shadow-sm border border-green-200'
          : 'text-green-500 hover:text-green-700 hover:bg-white/60'
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      Property Details
    </button>
    <button
      onClick={() => setActiveTab('history')}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
        activeTab === 'history'
          ? 'bg-white text-green-900 shadow-sm border border-green-200'
          : 'text-green-500 hover:text-green-700 hover:bg-white/60'
      }`}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Immutable History
      {timelineEvents.length > 0 && (
        <span
          className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            activeTab === 'history' ? 'bg-green-100 text-green-800' : 'bg-green-200 text-green-600'
          }`}
        >
          {timelineEvents.length}
        </span>
      )}
    </button>
  </div>
);

export default TabNavigation;
