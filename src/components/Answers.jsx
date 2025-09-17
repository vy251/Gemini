import { useEffect, useState } from "react";
import { call, replace } from "../Help";

function Answers({ answers, index, totalresult, type }) {
  const [heading, setheading] = useState(false);
  const [ans, setans] = useState(answers);
  useEffect(() => {
    if (call(answers)) {
      setheading(true);
      setans(replace(answers));
    } 
  }, []);
  return (
    <>
      {index == 0 && totalresult > 1 ? (
        <span className="pt-2 text-xl block text-white">{ans}</span>
      ) : heading ? (
        <span className="pt-2 text-lg block text-white">{ans}</span>
      ) : (
        <span className={type=='q'?'pl-1':'pl-5'}>{ans}</span>
      )}
    </>
  );
}

export default Answers;
