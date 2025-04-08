import BookDetail from "@/components/client/book/book.detail";
import BookLoader from "@/components/client/book/book.loader";
import { getBookByIdAPI } from "@/services/api";
import { App } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookPage = () => {
  let { id } = useParams();
  const { notification } = App.useApp();
  const [currentBook, setCurrentBook] = useState<IBookTable | null>(null);
  const [isLoadingBook, setIsLoadingBook] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const fetchBookById = async () => {
        setIsLoadingBook(true);
        const res = await getBookByIdAPI(id);
        if (res && res.data) {
          setCurrentBook(res.data);
        } else {
          notification.error({
            message: "Đã có lỗi xảy ra",
            description: res.message
          });
        }
        setIsLoadingBook(false);
      };
      fetchBookById();
    }
  }, [id]);
  return (
    <div>
      {isLoadingBook ? (
        <BookLoader />
      ) : (
        <BookDetail currentBook={currentBook} />
      )}
    </div>
  );
};

export default BookPage;
