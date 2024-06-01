export default function Message({index, query, answer}) {
  function processText(text) {
    const paragraphs = text.split('\n\n');
    
    const processedParagraphs = paragraphs.map((paragraph) => {
      const processedParagraph = paragraph
        .split('\n').join('<br />')
        .split(' ').join('&nbsp;');

      return `<p>${processedParagraph}</p>`;
    });
    console.log(processedParagraphs[1])
    return processedParagraphs;
  };

  return <div key={`query-answer-`+index}>
    <div className="flex flex-col bg-gray-100 rounded-r-lg rounded-bl-lg">
      <div className="px-3 py-2 h-min text-sm lg:text-base">
        {query}
      </div>
    </div>
    <div className="flex flex-col mt-3">
      <div className="flex gap-1">
        <img src="/logo.png" className="w-8" alt="image not found"/>
        <p className="font-bold mt-auto text-[#7B171C]">Mealster</p>
      </div>
      <div className="px-3 py-2 h-min text-sm lg:text-base animate-typing">
        {processText(answer)}
      </div>
    </div>
  </div>
}