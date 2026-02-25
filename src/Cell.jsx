function Cell({ value, row, col, onClick, onDropMove, selected }) {

    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ row, col }));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        onDropMove(data.row, data.col, row, col);
    };

    const allowDrop = (e) => {
        e.preventDefault();
    };

    if (value === -1)
        return <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px]"></div>;

    const isSelected = selected && selected.row === row && selected.col === col;

    return (
        <div onClick={() => onClick(row, col)} onDragOver={allowDrop} onDrop={handleDrop} className={`w-[50px] h-[50px] md:w-[60px] md:h-[60px] border border-gray-500 flex items-center justify-center bg-amber-200 ${isSelected ? "bg-yellow-300" : ""}`}>
            {value === 1 && (
                <div draggable onDragStart={handleDragStart} className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] bg-blue-700 rounded-full shadow-md cursor-grab active:cursor-grabbing"></div>
            )}
        </div>
    );
}

export default Cell;