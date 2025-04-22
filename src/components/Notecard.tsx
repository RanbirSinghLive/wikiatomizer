import { downloadMarkdown } from '../utils/downloadUtils';

interface NotecardProps {
  title: string;
  content: string;
  index: number;
}

const Notecard = ({ title, content, index }: NotecardProps) => {
  const handleDownload = () => {
    downloadMarkdown(title, content, index);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{content}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Notecard {index + 1}
        </span>
        <button
          onClick={handleDownload}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download .md
        </button>
      </div>
    </div>
  );
};

export default Notecard; 