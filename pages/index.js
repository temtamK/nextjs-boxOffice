import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import Error from 'next/error'
import Link from 'next/link'
import {DatePicker} from 'antd';
import Moment from 'moment'
import Router from 'next/router';

function Home(props) {
  // console.log(props.data.boxOfficeResult.dailyBoxOfficeList);
  if (props.error) {
    return <Error statusCode={500} title={props.error.message}/>
  }
  if (props.data.faultInfo) {
    return <Error statusCode={500} title={props.data.faultInfo.message}/>
  }
  return (
    <div>
      <Head>
        <title>Box Office</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>박스 오피스</h1>
      <div>
        <DatePicker 
          defaultValue={Moment(props.targetDt, 'YYYYMMDD')} 
          dateFormat={'YYYYMMDD'}
          onChange={date => Router.push('/?targetDt=' + date.format('YYYYMMDD'))}/>
      </div>
      {
        props.data.boxOfficeResult.dailyBoxOfficeList.map((item => 
          <div kye={item.movieCd}>
            [{item.rank}]
            {' '}
            <Link href="/movies/[code]" as={'/movies/' + item.movieCd}>
              <a>
                {item.movieNm}
              </a>
            </Link>
            {' '}
            <small>({item.openDt})</small>
          </div>
          ) )
      }
    </div>
  )
}

Home.getInitialProps = async function (context) {
    const targetDt = context.query.targetDt || Moment().subtract(1, 'day').format('YYYYMMDD');
    let url = 'https://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json';
    url += '?key=ec42fb86304b2b0c16f8682f6fc6d951';
    url += '&targetDt=' + targetDt;
    // Promise => async/await
    try {
      const response = await axios.get(url);
      return {
        targetDt,
        data: response.data,
      }
    }
    catch (error) {
      console.warn(error)
      return {error}
    }
}

export default Home;
