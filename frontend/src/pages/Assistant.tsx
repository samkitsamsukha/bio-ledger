export default function Assistant() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Assistant</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4 mb-6">
          {/* Sample conversation */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">U</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-900">What are the different BSL levels?</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">AI</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                There are four Biosafety Levels (BSL):
                <br /><br />
                BSL-1: Suitable for work with well-characterized agents not known to cause disease in healthy adults.
                <br /><br />
                BSL-2: Suitable for work with agents that pose moderate hazards to personnel and the environment.
                <br /><br />
                BSL-3: Suitable for work with indigenous or exotic agents that may cause serious or potentially lethal disease through inhalation.
                <br /><br />
                BSL-4: Suitable for work with dangerous and exotic agents that pose a high individual risk of aerosol-transmitted laboratory infections and life-threatening disease.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Ask about BSL levels and bio hazards..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}