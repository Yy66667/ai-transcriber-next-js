import { useState, type ChangeEvent, type FC } from 'react';


interface ModelSelectorProps {
  models: string[];
  onSelect: (model: string) => void;
}

const ModelSelector: FC<ModelSelectorProps> = ({ models, onSelect }) => {
  const [selectedModel, setSelectedModel] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedModel(value);
    onSelect(value); // pass selected value to parent
  };

  return (
   <div className="model-selector items-center h-15 justify-center bg-gray-100 gap-4 flex w-full  shadow-sm rounded-xl">
  <label htmlFor="model-dropdown" className="text-lg  items-center flex font-medium text-gray-700 ">
    Model : 
  </label>
  <div><select
    id="model-dropdown"
    value={selectedModel}
    onChange={handleChange}
    className=" border-slate-400 px-8 border-1 bg-white-200 py-2  rounded-lg font-medium focus:outline-none  text-gray-700 "
  >
    <option  value="" disabled>
                  -- choose a model --  
    </option>
    {models.map((model, index) => (
      <option key={index} value={model}>
        {model}
      </option>
    ))}
  </select>

  </div>
  
</div>

  );
};

export default ModelSelector;
