import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CustomExam = ({ setCustomExam, setQuizKey }) => {
  const handleChange = (e) => {
    setQuizKey(e.target.value);
  };
  const handleStart = () => {
    setCustomExam(false);
    console.log("exam started");
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center min-h-screen">
      <div className="h-[300px] flex flex-col justify-center items-center">
        <div className="mb-4 text-center">
          <label className="block text-gray-700 font-bold mb-2">
            Enter Quiz Key to Start
          </label>
          <Input
            type="text"
            name="quizKey"
            onChange={handleChange}
            className="text-center font-bold bg-secondary-color bg-opacity-20 text-black"
          />

          <Button
            onClick={handleStart}
            type="submit"
            className="mt-4 bg-primary-color text-white"
            variant="default"
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomExam;
