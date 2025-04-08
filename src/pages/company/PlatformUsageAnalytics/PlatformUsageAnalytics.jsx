import React from 'react';
import { useState, useEffect, Fragment } from 'react';
import { PageNavbar } from '@/pages/account';
import { Toolbar, ToolbarHeading } from '@/partials/toolbar';
import { PlatformCount } from './blocks/PlatformCount';
import { Userengagement } from './blocks/Userengagement';
import FeatureUsageChart  from './blocks/FeatureUsageChart';
import Piechart from './blocks/Piechart';
import axios from 'axios';
import { useSelector } from 'react-redux';
const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;

const PlatformUsageAnalytics = () => {
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey);

  const [platformCount, setPlatformCount] = useState([]);
  //const [userEngagement, setUserEngagement] = useState([]);
  const [userEngagementTimelines, setUserEngagementTimelines] = useState([]);
  const [userEngagementCounts, setUserEngagementCounts] = useState([]);
  //const [featureUsage, setFeatureUsage] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featureCounts, setFeatureCounts] = useState([]);
  //const [userRetention, setUserRetention] = useState([]);
  const [userRetentionLabels, setUserRetentionLabels] = useState([]);
  const [userRetentionCounts, setUserRetentionCounts] = useState([]);

  useEffect(() => {
    fetchPlatformUsageAnalytics();
  }, []);
  useEffect(() => {
    fetchEngagementGraph();
  }, []);
  useEffect(() => {
    fetchFeatureUsageGraph();
  }, []);
  useEffect(() => {
    fetchRetentionGraph();
  }, []);

  const fetchPlatformUsageAnalytics = async () => {
    try {
      const response = await axios.get(`${API_URL}/platform-analytics/usage-analytics`, {
        params: {
          numberOfDays: 365,
          companyId: companyId
        },
        headers: {
          'accept': '*/*'
        }
      });
      console.log('Response:', response.data);
      var tmp = response.data;
      var platformArr = [];
      // var platformObj = {
      //   logo: 'linkedin-2.svg',
      //   info: '9.3k',
      //   desc: 'Amazing mates',
      //   path: ''
      // }
      if(tmp){
        var platformObj = {
          logo: 'ki-user-square text-primary',
          info: '0',
          desc: '',
          path: ''
        }
        platformObj.desc = 'Total Users';
        platformObj.info = tmp.TotalUsers;
        platformArr.push(platformObj);

        platformObj = {
          logo: 'ki-user-tick text-danger',
          info: '0',
          desc: '',
          path: ''
        }

        platformObj.desc = 'Active Users';
        platformObj.info = tmp.ActiveUsers;
        platformArr.push(platformObj);

        platformObj = {
          logo: 'ki-mouse-circle text-success',
          info: '0',
          desc: '',
          path: ''
        }

        platformObj.desc = 'Feature AdoptionRate';
        platformObj.info = tmp.FeatureAdoptionRate? parseFloat(tmp.FeatureAdoptionRate).toFixed(2)+'%':'0%';
        platformArr.push(platformObj);

        platformObj = {
          logo: 'ki-two-credit-cart text-warning',
          info: '0',
          desc: '',
          path: ''
        }

        platformObj.desc = 'Retention Rate';
        platformObj.info = tmp.RetentionRate? parseFloat(tmp.RetentionRate).toFixed(2)+'%':'0%';;
        platformArr.push(platformObj);

       
      }
      
      setPlatformCount(platformArr);
    } catch (error) {
      console.error('Error fetching platform usage analytics:', error);
    }
  };

  const fetchEngagementGraph = async () => {
    try {
      const response = await axios.get(`${API_URL}/platform-analytics/engagement-graph-monthly`, {
        params: {
          companyId: companyId,
        },
        headers: {
          'accept': '*/*',
        },
      });
      console.log('Engagement Graph Response:', response.data);
      var tmp = response.data;
      var timelines = [];
      var counts = [];
      if(tmp && tmp.length){
        tmp.map((engObj, index) => {
          timelines.push(engObj.Month)
          counts.push(engObj.EngagementCount)
        })
      }
      setUserEngagementTimelines(timelines.reverse());
      setUserEngagementCounts(counts.reverse());
      
    } catch (error) {
      console.error('Error fetching engagement graph data:', error);
    }
  };

  const fetchFeatureUsageGraph = async () => {
    try {
      const response = await axios.get(`${API_URL}/platform-analytics/feature-usage-graph`, {
        params: {
          numberOfDays: 360,
          companyId: companyId,
        },
        headers: {
          'accept': '*/*',
        },
      });
      console.log('Feature Usage Graph Response:', response.data);
      var tmp = response.data;
      var f = [];
      var counts = [];
      if(tmp && tmp.length){
        tmp.map((fObj, index) => {
          f.push(fObj.FeatureName)
          counts.push(fObj.UsageCount)
        })
      }
      setFeatures(f);
      setFeatureCounts(counts);
    } catch (error) {
      console.error('Error fetching feature usage graph data:', error);
    }
  };

  const fetchRetentionGraph = async () => {
    try {
      const response = await axios.get(`${API_URL}/platform-analytics/retention-graph`, {
        params: {
          numberOfDays: 360,
          companyId: companyId,
        },
        headers: {
          'accept': '*/*',
        },
      });
      console.log('Retention Graph Response:', response.data);
      var tmp = response.data;
      var l = [];
      var counts = [];
      if(tmp && tmp.length){
        tmp.map((rObj, index) => {
          l.push(rObj.Category);
          counts.push(rObj.Percentage?Number(rObj.Percentage.toFixed(2)):0);
        })
      }
      setUserRetentionLabels(l);
      setUserRetentionCounts(counts);
    } catch (error) {
      console.error('Error fetching retention graph data:', error);
    }
  };

  return (
    <Fragment>
      <PageNavbar />
      <div className="container mx-auto px-6 py-8">
        {/* Toolbar */}
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-2xl font-bold leading-none text-gray-900">
              Platform Usage Analytics
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Effortless organization for streamlined operations.
            </p>
          </ToolbarHeading>
        </Toolbar>

        {/* Main Layout */}
        <div className="flex flex-wrap mt-8 gap-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 flex-grow">
            <PlatformCount platformCount={platformCount}/>
          </div>

          {/* User Engagement Chart */}
          <div className="flex-grow">
            <Userengagement userEngagementTimelines={userEngagementTimelines} userEngagementCounts={userEngagementCounts}/>
          </div>
        </div>

        <div className="flex gap-6 mt-8">
            <div className='w-full w-3/4'>
                
        <FeatureUsageChart featureCounts={featureCounts} features={features}/>
            </div>

          <Piechart
    title="User Retention"
    subtitle="Summary of successful and failed attempts"
    //chartData={[65, 35]}
    chartData={userRetentionCounts}
    chartOptions={{
      // labels: ["Successful", "Failed"],
      // colors: ["#CF9FFF", "#A2D9CE"],
      labels: userRetentionLabels,
      colors: ["#CF9FFF", "#A2D9CE"],
    }}
    //timeRangeOptions={["12 Hours", "24 Hours", "7 Days"]}
    timeRangeOptions={["12 Months"]}
    type="pie"
  />
        </div>
      </div>
    </Fragment>
  );
};

export default PlatformUsageAnalytics;
