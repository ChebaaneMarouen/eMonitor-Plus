import React, { Component, Fragment } from "react";
import Slider from "react-slick";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { User, Role } from "modules/ressources";
import UserCard from "./UserCard";

const SamplePrevArrow = ({ className, style, onClick }) =>{
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#c71904", borderRadius:"50%" }}
      onClick={onClick}
    />
  );
}

const SampleNextArrow = ({ className, style, onClick })=> {
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "#c71904", borderRadius:"50%" }}
      onClick={onClick}
    />
  );
}

class MonitorsSlider extends Component {
    constructor(props){
        super(props)
    }
    componentDidMount() {
        const { getUsers } = this.props;
        getUsers();
      }
    render() {
      const {t, users, news} = this.props;
      const settings = {
        className: "center",
        dots :true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow : users.length < 4 ? users.length : 4,
        swipeToSlide: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: users.length < 3 ? users.length : 3,
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: users.length < 2 ? users.length : 2,
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: users.length < 1 ? users.length : 1,
            }
          }
        ]
      };
      return (
        <div className="mrg-15">
          <h2 className="text-center mrg-bot-35">{t("TEXT_JOURNALISTES_ACTIFS")}</h2>
          <Slider {...settings}>
            {users.map((el,i)=><div key={i}><UserCard indice={i} user={el} news={news}/></div>)}
          </Slider>
        </div>
      );
    }
}
MonitorsSlider.defaultProps = {
    users: [],
    news : []
  };
function mapStateToProps(state) {
    return {
      users: state.data.users
    };
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      getUsers: () => dispatch(User.get())
    };
  }
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(MonitorsSlider));