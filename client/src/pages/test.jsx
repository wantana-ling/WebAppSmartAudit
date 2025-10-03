const Test = () => {
    return(
        <div className="container">
        <td className="text-center">
            <input
            type="checkbox"
            checked={selectedIds.includes(s.session_id)}
            onChange={() =>
                setSelectedIds(prev => prev.includes(s.session_id)
                ? prev.filter(id => id !== s.session_id)
                : [...prev, s.session_id]
                )
            }
            />
        </td>
        </div>
    );
};

export default Test;
