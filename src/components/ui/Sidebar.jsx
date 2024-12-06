import SidebarRow from "./SidebarRow";

const Sidebar = ({ pages, activePage, updateFavorite }) => {
    // 페이지 목록을 받아서 favorite인 페이지들을 먼저 보여줌. 이것들은 만약 favorite이 바뀐다면 실시간으로 반영되어야함.
    //안되는데?
    const sortedPages = [...pages].sort((a, b) => b.favorite - a.favorite);
    return (
        <div>
            {sortedPages.length > 0 ? (
                sortedPages.map((page) => (
                    <SidebarRow
                        key={page.id}
                        page={page}
                        activePage={activePage}
                        updateFavorite={updateFavorite}
                    />
                ))
            ) : (
                null
            )}
        </div>
    );
};

export default Sidebar;