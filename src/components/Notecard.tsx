interface NotecardProps {
  title: string;
  content: string;
  index: number;
}

const Notecard = ({ title, content, index }: NotecardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{content}</p>
      <div className="mt-4 text-sm text-gray-500">
        Notecard {index + 1}
      </div>
    </div>
  );
};

export default Notecard; 