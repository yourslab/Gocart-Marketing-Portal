var User = React.createClass({
    componentDidMount: function() {
        // This is extra code from the previous version (Didn't support react out of the box)
        if($('.work figure').length) {
            (function() {
                "use strict";

                function init() {
                    var speed = 330,
                        easing = mina.backout;

                    [].slice.call(document.querySelectorAll(' .gallery .grid li > a.work ,  .related .grid li > a.work')).forEach(function(el) {
                        var s = Snap(el.querySelector('svg')),
                            path = s.select('path'),
                            pathConfig = {
                                from: path.attr('d'),
                                to: el.getAttribute('data-path-to')
                            };

                        el.addEventListener('mouseenter', function() {
                            path.animate({
                                'path': pathConfig.to
                            }, speed, easing);
                        });

                        el.addEventListener('mouseover', function() {
                            path.animate({
                                'path': pathConfig.to
                            }, speed, easing);
                        });

                        el.addEventListener('mouseleave', function() {
                            path.animate({
                                'path': pathConfig.from
                            }, speed, easing);
                        });

                        el.addEventListener('mouseout', function() {
                            path.animate({
                                'path': pathConfig.from
                            }, speed, easing);
                        });
                    });
                }

                init();

            })();
        }

        $(".work figure").each(function() {
            var svg, height;
            svg = $(this).find("svg")[0];
            height = parseInt($(this).css("height"));
            //svg.setAttribute('viewBox', '0 0 175 ' + height);
            svg.setAttribute('viewBox', '0 0 175 ' + 325);
        });

              $( ".work" ).each(function() {  
        $(this).find("figure").css({
          'transform': 'scale(1,1)' ,
          '-moz-transform': 'scale(1,1)',
          '-webkit-transform': 'scale(1,1)',
          'opacity':'1'
      });
        if(filter != 'all' && !$(this).hasClass(filter)){
          $(this).find("figure").css({
            'transform': 'scale(0.8,0.8)' ,
            '-moz-transform': 'scale(0.8,0.8)',
            '-webkit-transform': 'scale(0.8,0.8)',
            'opacity':'0.5'
        });
        }
      });

        jQuery(window).on('resizestop', function() {
            $(".work figure").each(function() {
                var svg, height;
                svg = $(this).find("svg")[0];
                height = parseInt($(this).css("height"));
                svg.setAttribute('viewBox', '0 0 175 ' + height);
            });
        });

    },
    render: function() {
        return(
            <li className="col-md-3 col-sm-6">
        <a className="work" href={"user.html#"+this.props.id} data-path-to="m 0,0 0,87.7775 c 24.580441,3.12569 55.897012,-8.199417 90,-8.199417 34.10299,0 65.41956,11.325107 90,8.199417 L 180,0 z">
          <figure>
            <img src={this.props.prof_pic_link} />
            <svg preserveAspectRatio="none"><path d="m 0,0 0,171.14385 c 24.580441,15.47138 55.897012,24.75772 90,24.75772 34.10299,0 65.41956,-9.28634 90,-24.75772 L 180,0 0,0 z"></path></svg>
            <figcaption>
              <h3>{this.props.children}</h3>
              <div className="divider color-red" />
              <p>{this.props.username}</p>
              <div className="button"><i className="fa fa-eye"></i><span style={{color: '#fff !important'}}>View Inventory</span></div>
            </figcaption>
          </figure>
        </a>
      </li>
        );
    }
});

var UserList = React.createClass({
  render: function() {
    var userNodes = this.props.data.map(function (user) {
      if(user.prof_pic_link == null) {
        user.prof_pic_link = "https://s3-ap-southeast-1.amazonaws.com/gocartphotos/ilovemico2/1435922142446/9JysDH7-.jpg"
      } else {
        user.prof_pic_link = "https://s3-ap-southeast-1.amazonaws.com/gocartphotos/"+user.username+"/"+user.prof_pic_link+".jpg"
      }
      return (
        <User username={user.username} prof_pic_link={user.prof_pic_link} key={user.id} id={user.id}>
          {user.name}
        </User>
      );
    })
    return (
      <ul id="user-list" className="grid">
        {userNodes}
      </ul>
    );
  }
});

var UserSearchForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var search_string = React.findDOMNode(this.refs.search).value.trim();
    if (!search_string) {
      return;
    }
    this.props.onSearch(search_string)

    // Clear text
    React.findDOMNode(this.refs.search).value = '';
    return;
  },
    render: function() {
        return(
            <form className="searchForm" onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="col-md-offset-3 col-md-6 col-xs-offset-1 col-xs-10">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Search for a user..." ref="search" style={{backgroundColor: '#fff'}}/>
              <span className="input-group-btn">
                <input type="submit" value="Search" className="btn btn-danger" style={{marginTop: 0}} />
              </span>
            </div>
          </div>
        </div>
      </form>
        );
    }
});

var UserBox = React.createClass({
  handleSearch: function(search_string) {
    $.ajax({
      url: "https://gocart.ap01.aws.af.cm/user/search/"+search_string+"/-1/-1",
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  render: function() {
    return(
      <span>
        <UserSearchForm onSearch={this.handleSearch}/>
        <UserList data={this.state.data}/>
      </span>
    );
  }
});

React.render(
    <UserBox />,
    document.getElementById('user-box')
);