import { sampleData, UserData } from "./sampleData";
import Table from "./Table";

function App() {
  const tableData: UserData[] = sampleData;

  return (
    <div className="w-full">
      <Table tableData={tableData} />
    </div>
  );
}

export default App;
