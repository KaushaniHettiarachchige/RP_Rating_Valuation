const HomeTitles = ({ txt_1, txt_2, txt_3, discription }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 md:items-start md:justify-center">
      <div className="font-redhat relative flex flex-row flex-wrap items-center justify-center gap-2 text-[26px] leading-none font-extrabold md:justify-start md:text-[32px]">
        <span className="text-[#00703c]">{txt_1}</span>
        <span className="text-[#629037]">{txt_2}</span>
        <span className="text-[#00350d]">{txt_3}</span>
      </div>

      {discription && (
        <span className="text-left font-sans text-[14px] font-normal text-[#9e9e9e] italic">
          {discription}
        </span>
      )}
    </div>
  );
};

export default HomeTitles;
